import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5173,
    open: "/index.html",
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        caseLowlift: resolve(__dirname, "case-lowlift-v2.html"),
      },
    },
  },
});
