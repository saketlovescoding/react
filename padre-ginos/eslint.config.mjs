import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

/** @type {import { 'eslint' }.Linter.Config[]} */
export default [
    js.configs.recommended,
    prettier,
    {
        ...reactPlugin.configs.flat.recommended,
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    reactPlugin.configs.flat["jsx-runtime"],
    {
        files: ["**/*.js", "**/*.jsx", "**/*.tsx"],
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

        rules: {
            "react/no-unesacepd-entities": "off",
            "react/prop-types": "off",
        },
    },
];
