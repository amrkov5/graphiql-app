import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    include: ['src/**/*.test.tsx'],
    coverage: {
      include: ['src/Components/**', 'src/app/api/**'],
      exclude: [
        'src/app/[[...request]]/**',
        'src/app/history/**',
        'src/app/signin/**',
        'src/app/signup/**',
      ],
    },
  },
});
