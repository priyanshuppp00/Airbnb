import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/user/": {
        target: "https://airbnb-clone-diao.onrender.com",
      },
      "/api/store/": {
        target: "hhttps://airbnb-clone-diao.onrender.com",
      },
      "/api/auth/": {
        target: "https://airbnb-clone-diao.onrender.com",
      },
      "/api/host/": {
        target: "https://airbnb-clone-diao.onrender.com",
      },
      "/uploads/": {
        target: "https://airbnb-clone-diao.onrender.com",
      },
    },
  },
});
