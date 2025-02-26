import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1/": "http://localhost:8000",
    },
  },
  plugins: [react(), tailwindcss()],
});
