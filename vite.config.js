import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export const pathAliases = {
    "@": path.resolve(__dirname, "src/js"),
    "@account": path.resolve(__dirname, "src/js/account"),
    "@administration": path.resolve(__dirname, "src/js/administration"),
    "@app": path.resolve(__dirname, "src/js/app"),
    "@base": path.resolve(__dirname, "src/js/base"),
    "@files": path.resolve(__dirname, "src/js/files"),
    "@forms": path.resolve(__dirname, "src/js/forms"),
    "@groups": path.resolve(__dirname, "src/js/groups"),
    "@hmms": path.resolve(__dirname, "src/js/hmms"),
    "@indexes": path.resolve(__dirname, "src/js/indexes"),
    "@jobs": path.resolve(__dirname, "src/js/jobs"),
    "@labels": path.resolve(__dirname, "src/js/labels"),
    "@message": path.resolve(__dirname, "src/js/message"),
    "@ml": path.resolve(__dirname, "src/js/ml"),
    "@nav": path.resolve(__dirname, "src/js/nav"),
    "@otus": path.resolve(__dirname, "src/js/otus"),
    "@quality": path.resolve(__dirname, "src/js/quality"),
    "@references": path.resolve(__dirname, "src/js/references"),
    "@samples": path.resolve(__dirname, "src/js/samples"),
    "@sequences": path.resolve(__dirname, "src/js/sequences"),
    "@subtraction": path.resolve(__dirname, "src/js/subtraction"),
    "@users": path.resolve(__dirname, "src/js/users"),
    "@utils": path.resolve(__dirname, "src/js/utils"),
    "@wall": path.resolve(__dirname, "src/js/wall"),
};

export default defineConfig({
    resolve: {
        alias: pathAliases,
    },
    root: "src",
    build: {
        outDir: "../dist",
        sourcemap: true,
    },
    plugins: [
        createHtmlPlugin({}),
        react({
            include: "**/*.{jsx,tsx}",
        }),
    ],
});
