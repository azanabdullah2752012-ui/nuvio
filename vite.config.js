import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  // If running locally in dev, use '/'.
  // If deploying to Vercel (where VERCEL env is set), use '/'.
  // Otherwise default to '/nuvio/' for GitHub Pages repository deployment.
  const isVercel = process.env.VERCEL === '1';
  const base = command === 'serve' ? '/' : (isVercel ? '/' : '/nuvio/');

  return {
    plugins: [react()],
    base,
    server: {
      host: 'localhost',
      port: 5173,
      cors: true,
    }
  };
});
