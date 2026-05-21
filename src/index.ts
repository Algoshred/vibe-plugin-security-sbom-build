/**
 * @vibecontrols/vibe-plugin-security-sbom-build
 *
 * Syft + Grype SBOM/vuln provider for the `build` lifecycle stage.
 */
import { ProviderRegistry, TelemetryEmitter, createLifecycleHooks } from "@vibecontrols/plugin-sdk";
import type {
  HostServices,
  ProfileContext,
  VibePlugin,
  VibePluginFactory,
} from "@vibecontrols/plugin-sdk/contract";

import { SbomBuildProvider } from "./provider.js";

const PLUGIN_NAME = "security-sbom-build";
const PLUGIN_VERSION = "2026.521.1";

export const createPlugin: VibePluginFactory = (_ctx: ProfileContext): VibePlugin => {
  const provider = new SbomBuildProvider();
  const telemetry = new TelemetryEmitter(PLUGIN_NAME, PLUGIN_VERSION);

  const lifecycle = createLifecycleHooks({
    name: PLUGIN_NAME,
    telemetryEventName: "security.sbom-build.ready",
    onInit: async (host: HostServices) => {
      await provider.init(host);
      new ProviderRegistry(host).registerProvider("security.sbom", "syft-grype", provider);
      telemetry.emit("security.sbom-build.registered", {
        provider: "syft-grype",
        toolVersion: provider.toolVersion,
      });
    },
  });

  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    description: "Syft + Grype SBOM/vuln scanner for the build stage.",
    tags: ["backend", "provider", "integration"],
    capabilities: {
      storage: "rw",
      subprocess: true,
      audit: true,
      telemetry: true,
    },
    onServerStart: lifecycle.onServerStart,
    onServerStop: lifecycle.onServerStop,
  };
};

export default createPlugin;
export { SbomBuildProvider } from "./provider.js";
