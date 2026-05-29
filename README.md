# @vibecontrols/vibe-plugin-security-sbom-build

<!-- VIBECONTROLS_OSS_HEADER_START -->

> **License**: MIT — see [LICENSE](./LICENSE).
> **Note**: This plugin is open source. The `@vibecontrols/agent` runtime that loads it is **not** open source — it is a proprietary product of Burdenoff Consultancy Services Pvt. Ltd. See [vibecontrols.com](https://vibecontrols.com) for the agent.

<!-- VIBECONTROLS_OSS_HEADER_END -->

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

<!-- VIBECONTROLS_OSS_FOOTER_START -->

---

## License

Released under the [MIT License](./LICENSE).

Copyright (c) 2026 Burdenoff Consultancy Services Private Limited, Algoshred Technologies Private Limited, and all its sister companies.

Maintainer: **Vignesh T.V** — <https://github.com/tvvignesh>

## Credits

This plugin builds on the following upstream open-source projects. All trademarks and copyrights remain with their respective owners.

- **Syft** — <https://github.com/anchore/syft>
- **Grype** — <https://github.com/anchore/grype>

## About VibeControls

**VibeControls** is the agentic engineering mission control for AI-native teams. Vibe-plugins extend the VibeControls agent with new providers, tools, sessions, tunnels, storage backends, and security stages.

- Website: <https://vibecontrols.com>
- Documentation: <https://docs.vibecontrols.com>
- Plugin SDK: <https://github.com/algoshred/vibecontrols-plugin-sdk>
- All plugins: <https://github.com/algoshred?q=vibe-plugin-&type=all>

## Important: agent is not open source

The `@vibecontrols/agent` runtime that loads and orchestrates these plugins is **closed source** and proprietary to Burdenoff Consultancy Services Pvt. Ltd. Only the plugin contract and the plugins themselves are released under MIT. If you want a fully self-hostable agent, please open an issue or contact the maintainer.

<!-- VIBECONTROLS_OSS_FOOTER_END -->
