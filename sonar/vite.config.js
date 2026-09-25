import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    proxy: { '/api/catalog': { target: 'http://localhost:3001', changeOrigin: true, rewrite: path => path.replace(/^\/api\/catalog/, '') } },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // JSON Server writes these files on every mutation. They are runtime data,
    // not frontend source files: watching them resets the open admin profile.
    watch: {
      ignored: ['**/db.json', '**/db-*.json'],
    },
    proxy: {
      '/api/catalog': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/catalog/, ''),
      },
      '/api/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deezer/, ''),
      },
    },
  },
})
