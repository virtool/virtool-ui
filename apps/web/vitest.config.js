import os from "node:os";
import { defineConfig } from "vitest/config";
import viteConfigFn from "./vite.config";

const viteConfig = viteConfigFn({ command: "serve", mode: "test" });

export default defineConfig({
	...viteConfig,
	plugins: viteConfig.plugins
		.flat(Infinity)
		.filter((plugin) => !String(plugin?.name ?? "").startsWith("sentry")),
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/tests/setup.tsx"],
		globalSetup: ["./src/tests/globalSetup.ts"],
		silent: false,
		maxWorkers: Math.max(1, Math.floor(os.cpus().length / 2)),
	},
});
