import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/lookup': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,
      },
      '/us/rss': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
