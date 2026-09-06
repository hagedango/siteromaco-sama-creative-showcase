// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  build: { assets: '_assets', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: false,
  vite: {
    optimizeDeps: { exclude: ['aria-query', 'axobject-query'] },
    build: { cssMinify: 'esbuild' },
  },
});
