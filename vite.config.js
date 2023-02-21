import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
  },
  define: {
    "process.env": { REACT_APP_SC_ATTR: false, SC_ATTR: false },
  },
  plugins: [
    createHtmlPlugin({}),
    react({
      include: "**/*.{jsx,tsx}",
    }),
  ],
});
