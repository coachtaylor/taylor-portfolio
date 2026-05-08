import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5173,
    open: "/portfolio.html",
  },
  build: {
    rollupOptions: {
      input: {
        light: resolve(__dirname, "portfolio.html"),
        dark: resolve(__dirname, "portfolio_v1_dark.html"),
      },
    },
  },
});
