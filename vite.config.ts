import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative assets allow the same build to work both on the default
  // GitHub Pages project URL and later on preview.giorgiomicolitti.it.
  base: './',
})
