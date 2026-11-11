// Preview build: the same React components as a single-page app (hash routes, demo-mode forms),
// used for the shareable preview. The real site is the Next.js app (npm run build).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = p => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
  root: r('./spa'),
  base: './',
  publicDir: r('./public'),
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'next/link', replacement: r('./shim/link.jsx') },
      { find: 'next/navigation', replacement: r('./shim/navigation.js') },
      { find: /^@\//, replacement: r('./') },
    ],
  },
  define: {
    'process.env.NEXT_PUBLIC_DEMO': JSON.stringify('1'),
    'process.env.NEXT_PUBLIC_ASSET_BASE': JSON.stringify(''),
  },
  build: {
    outDir: r('./preview-dist'),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: { output: { entryFileNames: 'assets/app.js', chunkFileNames: 'assets/[name].js', assetFileNames: 'assets/[name][extname]' } },
  },
  logLevel: 'warn',
});
