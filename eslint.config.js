import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", ".output", ".vinxi", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { react, "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...(react.configs.flat.recommended?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  eslintPluginPrettier,
];
