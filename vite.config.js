import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'Epps',
      fileName: 'epps',
    },
    rollupOptions: {
      external: ['vue', 'crypto-js'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
