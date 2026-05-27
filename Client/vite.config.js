import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts")) return "charts";
          if (id.includes("framer-motion") || id.includes("motion")) return "motion";
          if (id.includes("lucide-react") || id.includes("react-icons")) return "icons";
          if (id.includes("@tanstack") || id.includes("axios") || id.includes("zustand")) return "query";
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "react";
          return "vendor";
        },
      },
    },
  },
});
