import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          virtuoso: ['react-virtuoso']
        }
      }
    }
  },
  
  // Environment variables
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    host: true
  },
  
  // Preview configuration for testing builds
  preview: {
    port: 3000,
    host: true
  }
})
