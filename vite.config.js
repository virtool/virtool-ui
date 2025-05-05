import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
    build: {
        outDir: "../dist",
        sourcemap: true,
    },
    resolve: {
        alias: {
            "@": path.resolve("src"),
            "@account": path.resolve("src/account"),
            "@administration": path.resolve("src/administration"),
            "@analyses": path.resolve("src/analyses"),
            "@app": path.resolve("src/app"),
            "@base": path.resolve("src/base"),
            "@dev": path.resolve("src/dev"),
            "@files": path.resolve("src/files"),
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
            "@users": path.resolve("src/users"),
            "@wall": path.resolve("src/wall"),
        },
    },
    plugins: [
        createHtmlPlugin({}),
        react({
            include: "**/*.{tsx}",
        }),
        sentryVitePlugin({
            org: "cfia-virtool",
            project: "cloud-ui",
        }),
        tailwindcss(),
    ],
    root: "src",
    server: {
        allowedHosts: ["virtool.local"],
    },
});
