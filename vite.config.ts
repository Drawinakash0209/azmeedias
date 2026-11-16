import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // React, GSAP and Motion together land just over Vite's default 500 kB warning (~180 kB gzipped).
  build: { chunkSizeWarningLimit: 600 },
})
