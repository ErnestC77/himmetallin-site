import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { seoGeoPlugin } from './vite-plugins/seo-geo'

// Set SINGLEFILE=1 to emit one self-contained dist/index.html (all JS/CSS/images inlined) —
// used to publish shareable preview artifacts. Normal build stays multi-file.
const single = !!(globalThis as { process?: { env?: Record<string, string> } }).process?.env?.SINGLEFILE

export default defineConfig({
  plugins: [react(), seoGeoPlugin(), ...(single ? [viteSingleFile()] : [])],
  build: single
    ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 100_000, reportCompressedSize: false }
    : {},
  server: { port: 5173 },
})
