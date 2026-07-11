import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // 2. This is the new, correct way to point '@' to your 'src' folder
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
