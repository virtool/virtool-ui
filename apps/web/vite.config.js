import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
    build: {
        outDir: "dist",
        sourcemap: true,
        rolldownOptions: {
            output: {
                advancedChunks: {
                    groups: [
                        {
                            name: "sentry",
                            test: /node_modules[\\/]@sentry[\\/]react/,
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
            "@base": path.resolve("src/base"),
            "@dev": path.resolve("src/dev"),
            "@forms": path.resolve("src/forms"),
            "@groups": path.resolve("src/groups"),
            "@hmm": path.resolve("src/hmm"),
            "@indexes": path.resolve("src/indexes"),
            "@jobs": path.resolve("src/jobs"),
            "@labels": path.resolve("src/labels"),
            "@message": path.resolve("src/message"),
            "@ml": path.resolve("src/ml"),
            "@nav": path.resolve("src/nav"),
            "@otus": path.resolve("src/otus"),
            "@quality": path.resolve("src/quality"),
            "@references": path.resolve("src/references"),
            "@samples": path.resolve("src/samples"),
            "@sequences": path.resolve("src/sequences"),
            "@subtraction": path.resolve("src/subtraction"),
            "@tests": path.resolve("src/tests"),
            "@uploads": path.resolve("src/uploads"),
            "@users": path.resolve("src/users"),
            "@wall": path.resolve("src/wall"),
        },
    },
    plugins: [
        tanstackStart({
            spa: {
                enabled: true,
            },
            router: {
                autoCodeSplitting: true,
            },
        }),
        react({
            include: "**/*.{tsx}",
            babel: {
                plugins: ["babel-plugin-react-compiler"],
            },
        }),
        sentryVitePlugin({
            org: "cfia-virtool",
            project: "cloud-ui",
        }),
        tailwindcss(),
    ],
    server: {
        allowedHosts: ["virtool.local"],
    },
});
