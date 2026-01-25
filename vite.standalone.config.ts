import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Standalone build: bundles React for script tag usage without dependencies
// CSS is inlined in the bundle
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/embed.ts"),
      name: "LubForms",
      formats: ["iife"],
      fileName: () => "lub-forms.standalone.js",
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        exports: "named",
      },
    },
    sourcemap: true,
    minify: "esbuild",
    // Don't generate separate CSS file for standalone
    cssCodeSplit: false,
  },
  css: {
    // Inline CSS into JS bundle
    extract: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
