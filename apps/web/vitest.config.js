import os from "node:os";
import path from "node:path";
import { defineConfig } from "vitest/config";
import viteConfigFn from "./vite.config";

// `mode: "test"` drops Nitro and `command: "serve"` drops Sentry, so neither is
// ever constructed here and the plugin list needs no further filtering.
const viteConfig = viteConfigFn({ command: "serve", mode: "test" });

export default defineConfig({
	...viteConfig,
	test: {
		globals: true,
		silent: false,
		// Per-process worker count. Several worktrees testing at once each spawn
		// this many workers and collectively oversubscribe the machine; set
		// `VT_TEST_WORKERS` to dial it down when running them in parallel.
		maxWorkers: process.env.VT_TEST_WORKERS
			? Number(process.env.VT_TEST_WORKERS)
			: Math.max(1, Math.floor(os.cpus().length / 2)),
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
					// Pin the assumption above. These are the two modules that open
					// Postgres at import; if one ever survives the client transform into
					// the browser program, the guard throws instead of quietly making
					// Docker a prerequisite again. Listed before the `@server` prefix
					// alias so they win.
					alias: [
						{
							find: /^@server\/(config|db\/pg)$/,
							replacement: path.resolve("src/tests/postgresGuard.ts"),
						},
					],
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
