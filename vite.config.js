import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'Epps',
      fileName: 'epps',
    },
    rollupOptions: {
      external: ['pinia', 'crypto-js'],
      output: {
        globals: {
          pinia: 'Pinia', 
          'crypto-js': 'CryptoJS'
        },
      },
    },
  },
})
