// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Устанавливает базовый путь для сборки и разработки
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Удобный доступ к src/
    },
  },
  server: {
    port: 3000, // Порт для локальной разработки
  },
  build: {
    outDir: 'dist', // Папка для финальной сборки
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделение крупных библиотек для оптимизации
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
