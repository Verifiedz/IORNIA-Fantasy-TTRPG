import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const noDiskAccessInRenderer = [
  "electron",
  "fs",
  "node:fs",
  "path",
  "node:path",
];

export default tseslint.config(
  {
    ignores: [
      "out",
      "release",
      "dist",
      "node_modules",
      "vendor/fmg",
      "sample-campaign",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Renderer: no direct disk/Electron access — everything goes through the preload bridge.
    files: ["src/renderer/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-restricted-imports": [
        "error",
        { paths: noDiskAccessInRenderer },
      ],
    },
  },
  {
    // Sections share core/design/the content API only — never each other.
    files: ["src/renderer/sections/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: noDiskAccessInRenderer, patterns: ["@sections/*"] },
      ],
    },
  },
  {
    // Core stays pure TypeScript: no Electron, no React, no DOM.
    files: ["src/core/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: ["electron", "react", "react-dom"] },
      ],
    },
  },
);
