import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        popup: path.resolve(__dirname, "public/popup.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
});
