/**
 * Syft + Grype manifest. Versions + sha256 pinned per CalVer release.
 * Checksums sourced from the upstream Anchore release checksums file.
 *
 * To refresh:
 *   curl -sL https://github.com/anchore/syft/releases/download/v<VER>/syft_<VER>_checksums.txt
 *   curl -sL https://github.com/anchore/grype/releases/download/v<VER>/grype_<VER>_checksums.txt
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
        sha256: "066c251652221e4d44fcc4d115ce3df33a91769da38c830a8533199db2f65aab",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "linux-arm64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_linux_arm64.tar.gz`,
        sha256: "cd228306e5cb0654baecb454f76611606b84899d27fa9ceb7da4df46b94fe84e",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "darwin-x64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_darwin_amd64.tar.gz`,
        sha256: "223f5a97653e0bb0a96580a04328d41d515ee742bfbdd917f0583dc43e66f423",
        binaryWithinArchive: "syft",
        archive: "tar.gz",
      },
      "darwin-arm64": {
        url: `https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_darwin_arm64.tar.gz`,
        sha256: "bc5ad238a7cc60f19459b6f358079847bff5f8e520c8239706730f3fc5c5edd5",
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
        sha256: "89f8ccbaa7a47abab90e9e894a925a92ef47a4d2bf0981001e654527378d6ed4",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "linux-arm64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_linux_arm64.tar.gz`,
        sha256: "aa96abd5bd6912f50ee1763a445a49dc37fafdc2a8354876f7e4802341701f7c",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "darwin-x64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_darwin_amd64.tar.gz`,
        sha256: "c66e5939b1cf11b63855d5d16b291740ae0bf46b3a0f87689d164de652a57d8c",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
      "darwin-arm64": {
        url: `https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_darwin_arm64.tar.gz`,
        sha256: "88b7270120fb761b56742ee1d946849fd722d790c8dc31b28ce7ad1d71f44d6b",
        binaryWithinArchive: "grype",
        archive: "tar.gz",
      },
    },
  },
};
