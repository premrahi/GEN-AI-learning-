import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend runs on port 8080. Every /api/* request is proxied to the
// backend (default port 4000) so there are no CORS issues in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4002,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
