import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
    build: {
        outDir: "../dist",
        sourcemap: true,
    },
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve("src/js"),
            "@account": path.resolve("src/js/account"),
            "@administration": path.resolve("src/js/administration"),
            "@app": path.resolve("src/js/app"),
            "@base": path.resolve("src/js/base"),
            "@files": path.resolve("src/js/files"),
            "@forms": path.resolve("src/js/forms"),
            "@groups": path.resolve("src/js/groups"),
            "@hmms": path.resolve("src/js/hmms"),
            "@indexes": path.resolve("src/js/indexes"),
            "@jobs": path.resolve("src/js/jobs"),
            "@labels": path.resolve("src/js/labels"),
            "@message": path.resolve("src/js/message"),
            "@ml": path.resolve("src/js/ml"),
            "@nav": path.resolve("src/js/nav"),
            "@otus": path.resolve("src/js/otus"),
            "@quality": path.resolve("src/js/quality"),
            "@references": path.resolve("src/js/references"),
            "@samples": path.resolve("src/js/samples"),
            "@sequences": path.resolve("src/js/sequences"),
            "@subtraction": path.resolve("src/js/subtraction"),
            "@tests": path.resolve("src/tests"),
            "@users": path.resolve("src/js/users"),
            "@utils": path.resolve("src/js/utils"),
            "@wall": path.resolve("src/js/wall"),
        },
    },
    plugins: [
        createHtmlPlugin({}),
        react({
            include: "**/*.{jsx,tsx}",
        }),
        sentryVitePlugin({
            org: "cfia-virtool",
            project: "cloud-command",
        }),
    ],
    root: "src",
});
