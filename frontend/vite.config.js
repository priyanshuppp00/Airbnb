import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/user/": {
        target: "http://localhost:3000",
      },
      "/api/store/": {
        target: "http://localhost:3000",
      },
      "/api/auth/": {
        target: "http://localhost:3000",
      },
      "/api/host/": {
        target: "http://localhost:3000",
      },
      "/uploads/": {
        target: "http://localhost:3000",
      },
    },
  },
});
