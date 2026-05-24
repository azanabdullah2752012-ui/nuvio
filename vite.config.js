import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force HMR reload and cache refresh
export default defineConfig({
  plugins: [react()],
  base: '/nuvio/',
})
