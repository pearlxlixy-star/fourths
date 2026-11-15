import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the production build works from any folder on a static host.
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
