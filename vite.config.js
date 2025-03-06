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
            "@": path.resolve("src/js"),
            "@account": path.resolve("src/js/account"),
            "@administration": path.resolve("src/js/administration"),
            "@analyses": path.resolve("src/js/analyses"),
            "@app": path.resolve("src/js/app"),
            "@base": path.resolve("src/js/base"),
            "@files": path.resolve("src/js/files"),
            "@forms": path.resolve("src/js/forms"),
            "@groups": path.resolve("src/js/groups"),
            "@hmm": path.resolve("src/js/hmm"),
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
