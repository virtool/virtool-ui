import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
  },
  plugins: [
    createHtmlPlugin({}),
    react({
      include: "**/*.{jsx,tsx}",
    }),
  ],
});
