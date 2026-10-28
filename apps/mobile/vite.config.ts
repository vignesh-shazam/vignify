import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const projectRoot = __dirname;

export default defineConfig({
  plugins: [react()],

  // Load .env.local from the mobile app root
  envDir: projectRoot,

  root: path.resolve(projectRoot, "src/entry"),
  base: "./",

  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
  },

  publicDir: path.resolve(projectRoot, "public"),

  build: {
    outDir: path.resolve(projectRoot, "capacitor-web"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
