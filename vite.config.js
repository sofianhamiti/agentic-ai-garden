import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import md from 'vite-plugin-md'

export default defineConfig({
  base: '/agentic-ai-garden/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true
  }
})
