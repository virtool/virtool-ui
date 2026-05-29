import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import path from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig(({ command }) => ({
	build: {
		sourcemap: true,
		rolldownOptions: {
			output: {
				advancedChunks: {
					groups: [
						{
							name: "sentry",
							test: /node_modules[\\/]@sentry[\\/]/,
						},
					],
				},
			},
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	envPrefix: ["VITE_", "VT_"],
	resolve: {
		alias: {
			"@": path.resolve("src"),
			"@account": path.resolve("src/account"),
			"@administration": path.resolve("src/administration"),
			"@analyses": path.resolve("src/analyses"),
			"@app": path.resolve("src/app"),
			"@banner": path.resolve("src/banner"),
			"@base": path.resolve("src/base"),
			"@dev": path.resolve("src/dev"),
			"@forms": path.resolve("src/forms"),
			"@groups": path.resolve("src/groups"),
			"@hmm": path.resolve("src/hmm"),
			"@indexes": path.resolve("src/indexes"),
			"@jobs": path.resolve("src/jobs"),
			"@labels": path.resolve("src/labels"),
			"@ml": path.resolve("src/ml"),
			"@nav": path.resolve("src/nav"),
			"@otus": path.resolve("src/otus"),
			"@quality": path.resolve("src/quality"),
			"@references": path.resolve("src/references"),
			"@samples": path.resolve("src/samples"),
			"@sequences": path.resolve("src/sequences"),
			"@server": path.resolve("src/server"),
			"@subtraction": path.resolve("src/subtraction"),
			"@tasks": path.resolve("src/tasks"),
			"@tests": path.resolve("src/tests"),
			"@uploads": path.resolve("src/uploads"),
			"@users": path.resolve("src/users"),
			"@wall": path.resolve("src/wall"),
		},
	},
	plugins: [
		tanstackStart({
			router: {
				autoCodeSplitting: true,
			},
		}),
		nitro(),
		react({
			include: "**/*.{tsx}",
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
		// Build only: uploads source maps and adds route/middleware
		// instrumentation. Kept out of dev/test so Sentry never loads there. Must
		// come last.
		command === "build" &&
			sentryTanstackStart({
				org: "cfia-virtool",
				project: "cloud-ui",
				authToken: process.env.SENTRY_AUTH_TOKEN,
			}),
	],
	optimizeDeps: {
		holdUntilCrawlEnd: false,
		include: [
			"@hookform/resolvers/zod",
			"@tanstack/react-query",
			"@tanstack/react-router",
			"@tanstack/react-virtual",
			"class-variance-authority",
			"clsx",
			"d3",
			"d3-transition",
			"downshift",
			"es-toolkit",
			"es-toolkit/array",
			"es-toolkit/compat",
			"es-toolkit/math",
			"es-toolkit/object",
			"es-toolkit/predicate",
			"es-toolkit/string",
			"fuse.js",
			"lucide-react",
			"marked",
			"numbro",
			"radix-ui",
			"react-dropzone",
			"react-hook-form",
			"superagent",
			"tailwind-merge",
			"zod",
			"zod/v4",
			"zustand",
			"zustand/middleware",
		],
	},
	server: {
		allowedHosts: ["virtool.local"],
		warmup: {
			clientFiles: [
				"./src/routes/__root.tsx",
				"./src/routes/_authenticated.tsx",
				"./src/app/**/*.{ts,tsx}",
				"./src/base/**/*.{ts,tsx}",
				"./src/nav/**/*.{ts,tsx}",
			],
		},
	},
}));
