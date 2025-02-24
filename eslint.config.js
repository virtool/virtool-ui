import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...fixupConfigRules(
        compat.extends(
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:react-hooks/recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended",
        ),
    ),
    {
        plugins: {
            react: fixupPluginRules(react),
            "react-hooks": fixupPluginRules(reactHooks),
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            vitest,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                console: true,
                dispatcher: true,
                document: true,
                fetch: true,
                global: true,
                process: true,
                window: true,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            curly: ["warn", "all"],

            "func-style": [
                "warn",
                "declaration",
                {
                    allowArrowFunctions: false,
                },
            ],

            "no-else-return": "warn",
            "no-prototype-builtins": "warn",
            "prefer-arrow-callback": "warn",
            "prefer-const": "warn",
            "react/display-name": "warn",
            "react/no-unescaped-entities": "warn",
            "react/react-in-jsx-scope": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        files: ["**/*.jsx", "**/*.tsx"],

        rules: {
            "react/prop-types": "off",
        },
    },
    {
        files: ["**/*.test.tsx", "**/*.test.ts", "**/*.test.js", "**/*.test.jsx"],

        rules: {
            "no-global-assign": "off",
        },
    },
    {
        files: ["**/nonce.js"],

        rules: {
            "no-undef": "off",
        },
    },
];
