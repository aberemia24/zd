/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@shared-constants': path.resolve(__dirname, '../shared-constants')
    }
  },
  server: { 
    port: 3000,
    open: false
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/jest-compat.ts', './src/setupTests.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/e2e/**',
      '**/tests/**/e2e/**'
    ],
    env: {
      VITE_SUPABASE_URL: 'https://mock-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'mock-anon-key'
    },
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results/index.html'
    }
  }
}); 