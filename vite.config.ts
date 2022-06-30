import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import antdLayout from 'vite-plugin-antd-layout';
import * as path from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: '',
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path: any) => path.replace(/^\/api/, '')
      }
    },
  },
  plugins: [react(), antdLayout()],
  preview: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api/': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        headers: {
          'x-forwarded-proto': 'https',
        },
      },
    },
  },
});
