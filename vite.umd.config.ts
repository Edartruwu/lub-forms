import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// UMD build: Single entry for script tag usage (requires React on page)
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/embed.ts"),
      name: "LubForms",
      formats: ["umd"],
      fileName: () => "lub-forms.umd.js",
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        exports: "named",
        assetFileNames: "lub-forms.[ext]",
      },
    },
    sourcemap: true,
    minify: "esbuild",
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
