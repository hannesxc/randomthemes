import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        dir: './assets',
        entryFileNames: 'index.js',
        assetFileNames: (asset) => {
          if (asset.name.split(".")[1] === 'css') return 'main.css'
          return `session/[name].[ext]`
        },
        chunkFileNames: undefined,
        manualChunks: undefined,
      }
    },
    emptyOutDir: false,
  }
})
