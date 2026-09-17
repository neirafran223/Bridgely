import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:4000",
      "/ideas": "http://localhost:4000",
      "/postulaciones": "http://localhost:4000",
      "/chat": "http://localhost:4000",
      "/developers": "http://localhost:4000",
      "/equipos": "http://localhost:4000",
      "/transacciones": "http://localhost:4000",
      "/calificaciones": "http://localhost:4000",
      "/notificaciones": "http://localhost:4000",
      "/admin": "http://localhost:4000",
      "/clientes": "http://localhost:4000",
      "/upload": "http://localhost:4000",
      "/health": "http://localhost:4000",
      "/socket.io": {
        target: "http://localhost:4000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
