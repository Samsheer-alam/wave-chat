import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
