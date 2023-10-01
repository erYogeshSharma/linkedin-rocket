import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
const manifest = defineManifest({
  manifest_version: 3,
  name: "test-react-vite-4",
  version: "1.0.0",
  action: { default_popup: "index.html" },
  content_scripts: [{ js: ["src/content.ts"], matches: ["https://www.linkedin.com/*"] }],
  // options_page: "src/options/index.html",
  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },
  permissions: ["tabs", "storage"],
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
