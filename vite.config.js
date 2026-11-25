import { copyFileSync, existsSync } from 'node:fs'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-cname',
      closeBundle() {
        if (existsSync('CNAME')) copyFileSync('CNAME', 'dist/CNAME')
      },
    },
  ],
})
