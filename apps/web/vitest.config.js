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
		silent: false,
		maxWorkers: Math.max(1, Math.floor(os.cpus().length / 2)),
		projects: [
			{
				extends: true,
				test: {
					name: "web",
					environment: "jsdom",
					setupFiles: ["./src/tests/setup.tsx"],
					globalSetup: ["./src/tests/globalSetup.ts"],
					include: ["src/**/*.test.{ts,tsx}"],
					exclude: ["src/server/**"],
				},
			},
			{
				extends: true,
				test: {
					// Server code runs on Node in production and must be tested there.
					// Under jsdom its typed arrays come from a different realm, so bytes
					// read back from storage compare unequal to the bytes written.
					name: "server",
					environment: "node",
					globalSetup: ["./src/tests/globalSetup.ts"],
					include: ["src/server/**/*.test.ts"],
				},
			},
		],
	},
});
