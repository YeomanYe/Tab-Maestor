import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        manifest_version: 3,
        background: {
          service_worker: 'src/background/index.ts',
          type: 'module',
        },
        action: {
          default_title: 'Open Tab Maestro',
        },
        options_page: 'index.html',
        permissions: ['tabs', 'storage', 'contextMenus', 'notifications'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        format: 'iife',
        inlineDynamicImports: false,
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name].js';
        },
      },
    },
  },
});
