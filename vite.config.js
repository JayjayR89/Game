import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          physics: ['cannon-es'],
          controls: ['hammerjs']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  optimizeDeps: {
    include: ['three', 'cannon-es', 'hammerjs']
  }
})