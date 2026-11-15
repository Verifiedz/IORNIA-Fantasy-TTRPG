import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: "src/main/index.ts",
      },
    },
    resolve: {
      alias: {
        "@core": resolve("src/core"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      // Electron's preload loader (especially with sandbox: true) requires
      // CommonJS, regardless of the root package.json's "type": "module".
      rollupOptions: {
        output: {
          format: "cjs",
          entryFileNames: "[name].js",
        },
      },
      lib: {
        entry: "src/preload/index.ts",
      },
    },
  },
  renderer: {
    root: "src/renderer",
    build: {
      rollupOptions: {
        input: resolve("src/renderer/index.html"),
      },
    },
    resolve: {
      alias: {
        "@core": resolve("src/core"),
        "@design": resolve("src/renderer/design"),
        "@shell": resolve("src/renderer/shell"),
        "@sections": resolve("src/renderer/sections"),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
