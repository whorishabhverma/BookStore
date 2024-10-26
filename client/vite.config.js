import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.pdf'],
  // If you need to serve PDFs from the public directory
  publicDir: 'public',
})







