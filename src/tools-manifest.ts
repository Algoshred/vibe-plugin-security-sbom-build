/**
 * Syft + Grype manifest. Versions pinned per CalVer release; sha256
 * values are PLACEHOLDERS until the publish workflow refreshes them
 * from the upstream Anchore release checksums file.
 */
import type { ToolManifest } from "@vibecontrols/vibe-plugin-security/tool-installer";

export const SYFT_VERSION = "1.18.1";
export const GRYPE_VERSION = "0.85.0";

export const TOOLS_MANIFEST: ToolManifest = {
  syft: {
    version: SYFT_VERSION,
    binaryName: "syft",
    versionMatcher: SYFT_VERSION.replace(/\./g, "\\."),
    downloads: {
      "linux-x64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_linux_amd64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "linux-arm64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_linux_arm64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "darwin-x64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_darwin_amd64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "darwin-arm64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_darwin_arm64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
    },
  },
  grype: {
    version: GRYPE_VERSION,
    binaryName: "grype",
    versionMatcher: GRYPE_VERSION.replace(/\./g, "\\."),
    downloads: {
      "linux-x64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_linux_amd64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "linux-arm64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_linux_arm64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "darwin-x64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_darwin_amd64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "darwin-arm64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_darwin_arm64.tar.gz`,
        sha256: "PLACEHOLDER_REPLACE_BEFORE_PUBLISH",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
    },
  },
};
