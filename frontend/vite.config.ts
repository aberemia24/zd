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
    env: {
      VITE_SUPABASE_URL: 'https://mock-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'mock-anon-key'
    }
  }
}); 