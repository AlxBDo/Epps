import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            exclude: [
                ...coverageConfigDefaults.exclude,
                '**/App.vue',
                '**/main.js',
                '**/module-declaration.ts',
                '**/components/**',
                '**/lib/**',
                '**/models/**',
                '**/plugins/createPlugin.ts',
                '**/services/IndexedDB.ts',
                '**/services/WindowStorage.ts',
                '**/stores/experiments/**',
                '**/types/**',
                '**/utils/log.ts',
                '**/utils/encryption.ts'
            ],
            reporter: ['text', 'html'],
            provider: 'v8'
        },
    },
})