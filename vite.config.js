import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@community': path.resolve(__dirname, './src/features/community'),
      '@home': path.resolve(__dirname, './src/features/home'),
      '@post': path.resolve(__dirname, './src/features/post'),
      '@profile': path.resolve(__dirname, './src/features/profile'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
})
