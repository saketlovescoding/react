import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import { 'eslint' }.Linter.Config[]} */
export default [
    js.configs.recommended,
    prettier,
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
];
