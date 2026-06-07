import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'serve' ? '/' : '/nuvio/',
    server: {
      host: 'localhost',
      port: 5173,
      cors: true,
    }
  }
})
