import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: true,  // Cho phép truy cập từ bên ngoài container
    proxy: {
      "/api": {
        target: "http://localhost:8081", // 👉 backend của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
