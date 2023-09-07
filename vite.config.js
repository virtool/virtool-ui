import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    sourcemap: true,
  },
  plugins: [
    createHtmlPlugin({}),
    react({
      include: "**/*.{jsx,tsx}",
    }),
  ],
});
