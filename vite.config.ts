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
        },
        action: {
          default_popup: 'popup.html',
          default_title: 'Open Tab Maestro',
        },
        options_page: 'index.html',
        permissions: ['tabs', 'storage', 'contextMenus', 'notifications'],
        commands: {
          'save-current-tab': {
            suggested_key: {
              default: 'Ctrl+Q',
              mac: 'MacCtrl+Q',
            },
            description: 'Save the current tab',
          },
          'save-all-tabs': {
            suggested_key: {
              default: 'Ctrl+Shift+Q',
              mac: 'MacCtrl+A',
            },
            description: 'Save all tabs',
          },
        },
        icons: {
          '16': 'icons/icon16.png',
          '32': 'icons/icon32.png',
          '48': 'icons/icon48.png',
          '128': 'icons/icon128.png',
        },
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
    sourcemap: process.argv.includes('--watch'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
});
