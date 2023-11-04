import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
const manifest = defineManifest({
  manifest_version: 3,
  name: "Comments Rocket",
  version: "1.0.0",
  // action: { default_popup: "src/popup/index.html" },
  content_scripts: [{ js: ["src/content/index.ts"], matches: ["https://www.linkedin.com/*"] }],
  // options_page: "src/options/options.html",

  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  action: {
    default_icon: "src/assets/logo.png",
  },
  permissions: ["tabs", "storage"],
  icons: {
    16: "src/assets/logo.png",
    32: "src/assets/logo.png",
    48: "src/assets/logo.png",
    128: "src/assets/logo.png",
  },
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
