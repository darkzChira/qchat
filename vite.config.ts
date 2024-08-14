import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chatapp': {
        target: 'https://goldfish-app-ewgy2.ondigitalocean.app',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/chatapp/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
