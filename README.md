# @vibecontrols/vibe-plugin-security-sbom-build

Generates a CycloneDX SBOM via Syft and scans it for known vulnerabilities via Grype. Targets the `build` lifecycle stage in [VibeControls](https://vibecontrols.com).

Registers as a `security.sbom` provider (name `syft-grype`) with the [`@vibecontrols/vibe-plugin-security`](https://www.npmjs.com/package/@vibecontrols/vibe-plugin-security) meta plugin.

## Install

```bash
vibe plugin install @vibecontrols/vibe-plugin-security-sbom-build
vibe security providers set-default --stage build --provider syft-grype
```

Both Syft (Anchore) and Grype (Anchore) binaries are downloaded automatically on first use with sha256 verification.

## Outputs

- `sbom.cdx.json` — CycloneDX 1.5 SBOM (evidence type `sbom-cyclonedx`)
- `grype.json` — Grype vulnerability report (evidence type `grype-json`)
- `NormalizedFinding[]` — one row per `matches[]` entry with CVE, package, fix version, severity

## License

Proprietary — Burdenoff Consultancy Services Pvt. Ltd.
