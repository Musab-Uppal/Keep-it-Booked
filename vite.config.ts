import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this number to your desired port
    strictPort: true,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            } else if (id.includes("@mui") || id.includes("@emotion")) {
              return "mui";
            } else if (id.includes("@supabase")) {
              return "supabase";
            } else if (id.includes("@tanstack")) {
              return "query";
            }
          }
        },
      },
    },
  },
});
