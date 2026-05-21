import { describe, expect, test } from "bun:test";

import { SbomBuildProvider } from "../src/provider.js";
import { GRYPE_VERSION, SYFT_VERSION } from "../src/tools-manifest.js";

describe("SbomBuildProvider", () => {
  test("name + stage are immutable identifiers", () => {
    const p = new SbomBuildProvider();
    expect(p.name).toBe("syft-grype");
    expect(p.stage).toBe("build");
  });

  test("toolVersion encodes both Syft + Grype versions", () => {
    const p = new SbomBuildProvider();
    expect(p.toolVersion).toContain(SYFT_VERSION);
    expect(p.toolVersion).toContain(GRYPE_VERSION);
  });

  test("metadata supports backend + container + iac profiles", () => {
    const p = new SbomBuildProvider();
    const m = p.metadata();
    expect(m.supportedProfiles).toContain("backend");
    expect(m.supportedProfiles).toContain("container");
    expect(m.supportedProfiles).toContain("iac");
  });

  test("cancel() on unknown run is a no-op", async () => {
    const p = new SbomBuildProvider();
    await expect(p.cancel("nope")).resolves.toBeUndefined();
  });
});
