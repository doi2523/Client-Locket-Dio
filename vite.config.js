import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Hoặc '0.0.0.0'
  },
  plugins: [
    tailwindcss(),
    visualizer(),
    react(),
  ],
})