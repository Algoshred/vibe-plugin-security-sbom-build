/**
 * SbomBuildProvider — generates a CycloneDX SBOM with Syft, scans it
 * with Grype, emits both as evidence + NormalizedFinding[] (one per
 * matches[] entry).
 */
import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import * as path from "node:path";

import type { HostServices } from "@vibecontrols/plugin-sdk/contract";
import { normalizeGrype } from "@vibecontrols/vibe-plugin-security/normalizer";
import { resolveToolPath } from "@vibecontrols/vibe-plugin-security/tool-installer";
import type {
  NormalizedFinding,
  ScanEvidenceArtifact,
  SecurityProvider,
  SecurityProviderMetadata,
  SecurityScanInput,
  SecurityScanResult,
  SecurityScanSummary,
  SecurityStage,
} from "@vibecontrols/vibe-plugin-security/types";

import { GRYPE_VERSION, SYFT_VERSION, TOOLS_MANIFEST } from "./tools-manifest.js";

interface SbomBuildConfig {
  syftFormat?: "cyclonedx-json" | "spdx-json";
  grypeOnly?: boolean;
  extraSyftArgs?: string[];
  extraGrypeArgs?: string[];
}

export class SbomBuildProvider implements SecurityProvider {
  readonly name = "syft-grype";
  readonly stage: SecurityStage = "build";
  readonly toolVersion = `syft@${SYFT_VERSION}+grype@${GRYPE_VERSION}`;

  private host?: HostServices;
  private syftPath?: string;
  private grypePath?: string;
  private active = new Map<string, ChildProcess>();

  async init(host: HostServices): Promise<void> {
    this.host = host;
  }

  async ensureToolInstalled(): Promise<void> {
    const dataDir =
      this.host?.getDataDir?.() ?? path.join(process.env.HOME ?? ".", ".boff/vibecontrols");
    const ctx = {
      dataDir,
      log: {
        info: (m: string) => this.host?.logger?.info?.("sbom-build-provider", m),
        warn: (m: string) => this.host?.logger?.warn?.("sbom-build-provider", m),
        error: (m: string) => this.host?.logger?.error?.("sbom-build-provider", m),
      },
    };
    this.syftPath = await resolveToolPath(ctx, "syft", TOOLS_MANIFEST.syft);
    this.grypePath = await resolveToolPath(ctx, "grype", TOOLS_MANIFEST.grype);
  }

  async run(input: SecurityScanInput): Promise<SecurityScanResult> {
    if (!this.syftPath || !this.grypePath) {
      await this.ensureToolInstalled();
    }
    if (!this.syftPath || !this.grypePath) {
      throw new Error("sbom-build-provider: tool paths unavailable");
    }

    const startedAt = Date.now();
    const cfg = (input.config as SbomBuildConfig) ?? {};
    const sbomFormat = cfg.syftFormat ?? "cyclonedx-json";
    const sbomPath = path.join(
      input.workdir,
      sbomFormat === "spdx-json" ? "sbom.spdx.json" : "sbom.cdx.json",
    );
    const grypePath = path.join(input.workdir, "grype.json");

    input.onProgress?.({ pct: 5, message: "Generating SBOM via Syft" });

    const syftArgs = ["scan", `dir:${input.repoLocalPath}`, "-o", `${sbomFormat}=${sbomPath}`];
    if (cfg.extraSyftArgs) syftArgs.push(...cfg.extraSyftArgs);

    const syftResult = await this.spawnAndWait(this.syftPath, input.runId, syftArgs);
    if (syftResult.code !== 0) {
      return errored(
        input.runId,
        startedAt,
        `syft exited ${syftResult.code}: ${syftResult.stderr.slice(0, 500)}`,
      );
    }

    input.onProgress?.({ pct: 50, message: "Scanning SBOM via Grype" });

    const grypeArgs = ["sbom:" + sbomPath, "-o", "json", "--file", grypePath];
    if (cfg.extraGrypeArgs) grypeArgs.push(...cfg.extraGrypeArgs);
    const grypeResult = await this.spawnAndWait(this.grypePath, input.runId, grypeArgs);
    if (grypeResult.code !== 0) {
      return errored(
        input.runId,
        startedAt,
        `grype exited ${grypeResult.code}: ${grypeResult.stderr.slice(0, 500)}`,
      );
    }

    input.onProgress?.({ pct: 85, message: "Normalizing findings" });

    const grypeRaw = await fs.readFile(grypePath, "utf-8");
    const findings = normalizeGrype(grypeRaw, this.name);

    const evidence: ScanEvidenceArtifact[] = [];
    for (const [type, p] of [
      [sbomFormat === "spdx-json" ? "sbom-spdx" : "sbom-cyclonedx", sbomPath] as const,
      ["grype-json", grypePath] as const,
    ]) {
      try {
        const buf = await fs.readFile(p);
        evidence.push({
          type,
          localPath: p,
          sha256: createHash("sha256").update(buf).digest("hex"),
          sizeBytes: buf.byteLength,
        });
      } catch {
        // optional — skip if file absent
      }
    }

    input.onProgress?.({ pct: 100, message: "Scan complete" });

    return {
      runId: input.runId,
      status: "succeeded",
      findings,
      evidence,
      durationMs: Date.now() - startedAt,
      summary: summarize(findings),
    };
  }

  async cancel(runId: string): Promise<void> {
    const child = this.active.get(runId);
    if (!child) return;
    child.kill("SIGTERM");
    setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        /* gone */
      }
    }, 5000);
    this.active.delete(runId);
  }

  metadata(): SecurityProviderMetadata {
    return {
      stage: this.stage,
      supportedProfiles: ["backend", "frontend", "cli", "sdk", "mcp", "container", "iac"],
      toolVersion: this.toolVersion,
      description: "Syft generates SBOM, Grype scans for vulnerabilities (build stage).",
    };
  }

  private spawnAndWait(
    bin: string,
    runId: string,
    args: string[],
  ): Promise<{ code: number | null; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
      const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
      this.active.set(runId, child);
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (b: Buffer) => (stdout += b.toString()));
      child.stderr?.on("data", (b: Buffer) => (stderr += b.toString()));
      child.on("close", (code) => {
        this.active.delete(runId);
        resolve({ code, stdout, stderr });
      });
      child.on("error", (err) => {
        this.active.delete(runId);
        resolve({ code: -1, stdout, stderr: err.message });
      });
    });
  }
}

function summarize(findings: NormalizedFinding[]): SecurityScanSummary {
  const s: SecurityScanSummary = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of findings) s[f.severity]++;
  return s;
}

function errored(runId: string, startedAt: number, reason: string): SecurityScanResult {
  return {
    runId,
    status: "errored",
    findings: [],
    evidence: [],
    durationMs: Date.now() - startedAt,
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    errorReason: reason,
  };
}
