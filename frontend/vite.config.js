import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://airbnb-backend-9kz8.onrender.com",
      },
      "/uploads/": {
        target: "https://airbnb-backend-9kz8.onrender.com",
      },
    },
  },
});
