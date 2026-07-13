import os from "node:os";
import { defineConfig } from "vitest/config";
import viteConfigFn from "./vite.config";

const viteConfig = viteConfigFn({ command: "serve", mode: "test" });

// The SPA needs the full Vite pipeline. The server suites only need path
// aliases — they run in a node environment against a real Postgres, and the
// jsdom setup file would blow up there on its `window` references.
const webConfig = {
	...viteConfig,
	plugins: viteConfig.plugins
		.flat(Infinity)
		.filter((plugin) => !String(plugin?.name ?? "").startsWith("sentry")),
};

export default defineConfig({
	test: {
		globalSetup: ["./src/tests/globalSetup.ts"],
		silent: false,
		maxWorkers: Math.max(1, Math.floor(os.cpus().length / 2)),
		projects: [
			{
				...webConfig,
				test: {
					name: "web",
					globals: true,
					environment: "jsdom",
					setupFiles: ["./src/tests/setup.tsx"],
					include: ["src/**/*.test.{ts,tsx}"],
					exclude: ["src/server/**"],
				},
			},
			{
				resolve: viteConfig.resolve,
				test: {
					name: "server",
					globals: true,
					environment: "node",
					include: ["src/server/**/*.test.ts"],
				},
			},
		],
	},
});
