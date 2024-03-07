import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { pathAliases } from "./vite.config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: pathAliases,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/tests/setupTests.jsx"],
        silent: false,
    },
});
