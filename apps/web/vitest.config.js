import os from "node:os";
import { defineConfig } from "vitest/config";
import viteConfigFn from "./vite.config";

const viteConfig = viteConfigFn({ command: "serve", mode: "test" });

export default defineConfig({
	...viteConfig,
	// Nitro is the server bundler; tests never ask it to serve anything, and it
	// holds file handles open that stall Vitest's shutdown for ten seconds. Sentry
	// is dropped for the same reason it is kept out of dev: it should never load
	// here.
	plugins: viteConfig.plugins.flat(Infinity).filter((plugin) => {
		const name = String(plugin?.name ?? "");
		return !name.startsWith("sentry") && !name.startsWith("nitro");
	}),
	test: {
		globals: true,
		silent: false,
		maxWorkers: Math.max(1, Math.floor(os.cpus().length / 2)),
		projects: [
			{
				extends: true,
				test: {
					// No globalSetup: the client transform strips server function bodies
					// and the server-only imports behind them, so nothing here reaches
					// Postgres. Component tests must not need Docker.
					name: "web",
					environment: "jsdom",
					setupFiles: ["./src/tests/setup.tsx"],
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
					exclude: ["src/server/storage/__tests__/integration.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					// The storage backends against the same services Python tests with:
					// Garage for S3 and Azurite for Azure Blob. Everything else fakes
					// storage with MemoryStorage and never starts these containers.
					name: "storage",
					environment: "node",
					globalSetup: ["./src/server/storage/test/globalSetup.ts"],
					include: ["src/server/storage/__tests__/integration.test.ts"],
					// Garage has to lay out a cluster before it serves any S3 traffic.
					testTimeout: 30_000,
					hookTimeout: 120_000,
				},
			},
		],
	},
});
