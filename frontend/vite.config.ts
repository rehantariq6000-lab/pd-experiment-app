import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server proxies API calls to the NestJS backend (localhost:3000),
// which in turn proxies /experiments and /exercises to the experiment API.
// This lets the frontend fetch same-origin paths like `/experiments`.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/experiments': { target: 'http://localhost:3000', changeOrigin: true },
      '/exercises': { target: 'http://localhost:3000', changeOrigin: true },
      '/auth': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})
