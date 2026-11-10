import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#globals': fileURLToPath(new URL('./src/globals', import.meta.url)),
      '#pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '#lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '#styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '#utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
})
