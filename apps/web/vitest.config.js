import os from "os";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
    ...viteConfig,
    plugins: viteConfig.plugins
        .flat(Infinity)
        .filter(plugin => !String(plugin?.name ?? "").startsWith("sentry")),
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/tests/setup.tsx"],
        silent: false,
        maxWorkers: Math.max(1, Math.floor(os.cpus().length / 2)),
    },
});
