import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'AASFlowCanvas',
      // Single IIFE file — no external deps (React is bundled in)
      formats: ['iife'],
      fileName: () => 'canvas-wc.js',
    },
    outDir: '../angular-app/src/assets/canvas-wc',
    emptyOutDir: true,
    // Bundle React so the WC is self-contained
    rollupOptions: {
      external: [],
    },
  },
});
