import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this repo's root, so the build writes index.html and
// assets/ there. The source page lives in src/index.html.
// base './' makes the built site work from any folder on any static host.
export default defineConfig({
  root: 'src',
  base: './',
  plugins: [react(), tailwindcss()],
  build: { outDir: '..', emptyOutDir: false },
})
