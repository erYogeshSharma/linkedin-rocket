import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
const manifest = defineManifest({
  manifest_version: 3,
  name: "Comments Rocket",
  version: "1.0.0",
  // action: { default_popup: "src/popup/index.html" },
  content_scripts: [{ js: ["src/content/index.ts"], matches: ["https://www.linkedin.com/*"] }],
  options_page: "src/popup/index.html",
  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },
  permissions: ["tabs", "storage"],
  icons: {
    16: "src/assets/logo.svg",
    32: "src/assets/logo.svg",
    48: "src/assets/logo.svg",
    128: "src/assets/logo.svg",
  },
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
