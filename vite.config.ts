import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/sistema-venda-certa/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? repoBase : '/',
  build: { 
    outDir: 'dist', 
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TypeScript errors during build
        if (warning.code === 'TYPESCRIPT') return;
        warn(warning);
      }
    }
  }
})
