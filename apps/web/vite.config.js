import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Restarted to sync module renames: 2026-05-02
export default defineConfig({
  plugins: [
    react(),
      // VitePWA({ ... original config ... })

  ],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
});

