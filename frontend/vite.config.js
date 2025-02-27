import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      "/api/v1/": "http://localhost:8000",
    },
  },
  plugins: [react(), tailwindcss()],
});
