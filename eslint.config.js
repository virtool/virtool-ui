import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/tests/setup.tsx", "dist/**"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
            "@vitest": vitest,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
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
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    ...storybook.configs["flat/recommended"],
    prettier,
    {
        files: ["**/*.tsx"],
        rules: {
            "react/prop-types": "off",
        },
    },
    {
        files: ["**/*.test.{ts,tsx,js,jsx}"],
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
);
