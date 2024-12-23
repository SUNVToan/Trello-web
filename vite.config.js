import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Resolve path alias
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
