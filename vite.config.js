import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Markdown from 'unplugin-vue-markdown/vite'
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync, createReadStream } from 'fs'
import { join, dirname, extname } from 'path'

// Plugin to serve and copy template assets
function templateAssetsPlugin() {
  return {
    name: 'template-assets',
    configureServer(server) {
      // Serve template assets during development
      server.middlewares.use('/agentic-ai-garden/src/data/content/build/templates', (req, res, next) => {
        try {
          // Remove the base path and construct local file path
          const filePath = req.url.replace('/agentic-ai-garden/src/data/content/build/templates', '')
          const fullPath = join(process.cwd(), 'src/data/content/build/templates', filePath)
          
          // Check if file exists and is an image
          if (existsSync(fullPath) && /\.(svg|png|jpg|jpeg|gif|webp|bmp|tiff|ico)$/i.test(fullPath)) {
            const ext = extname(fullPath).toLowerCase()
            const mimeTypes = {
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.bmp': 'image/bmp',
              '.tiff': 'image/tiff',
              '.ico': 'image/x-icon'
            }
            
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            res.setHeader('Cache-Control', 'public, max-age=31536000')
            
            const fileStream = createReadStream(fullPath)
            fileStream.pipe(res)
            return
          }
        } catch (error) {
          console.warn('Error serving template asset:', error.message)
        }
        next()
      })
    },
    closeBundle() {
      // Copy template assets during build
      const srcDir = fileURLToPath(new URL('./src/data/content/build/templates', import.meta.url))
      const outDir = fileURLToPath(new URL('./dist/src/data/content/build/templates', import.meta.url))
      
      function copyRecursive(src, dest) {
        try {
          const stat = statSync(src)
          if (stat.isDirectory()) {
            mkdirSync(dest, { recursive: true })
            const files = readdirSync(src)
            files.forEach(file => {
              copyRecursive(join(src, file), join(dest, file))
            })
          } else if (stat.isFile() && /\.(svg|png|jpg|jpeg|gif|webp|bmp|tiff|ico)$/i.test(src)) {
            mkdirSync(dirname(dest), { recursive: true })
            copyFileSync(src, dest)
          }
        } catch (error) {
          console.warn(`Could not copy ${src}:`, error.message)
        }
      }
      
      try {
        copyRecursive(srcDir, outDir)
        console.log('✓ Template assets copied to build output')
      } catch (error) {
        console.warn('Could not copy template assets:', error.message)
      }
    }
  }
}

export default defineConfig({
  base: '/agentic-ai-garden/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      wrapperClasses: 'markdown-body',
      frontmatter: true,
      exposeFrontmatter: false
    }),
    templateAssetsPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true,
    // Allow serving files from outside the root
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    // Include template assets in build
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      }
    }
  },
  // Copy template assets during build
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.bmp', '**/*.tiff', '**/*.ico']
})
