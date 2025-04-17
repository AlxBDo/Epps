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
                '**/services/IndexedDB.ts',
                '**/services/WindowStorage.ts',
                '**/stores/connectedUser.ts',
                '**/stores/contact.ts',
                '**/stores/item.ts',
                '**/stores/list.ts',
                '**/stores/lists.ts',
                '**/stores/user.ts',
                '**/types/**',
                '**/utils/log.ts',
            ],
            reporter: ['text', 'html'],
            provider: 'v8'
        },
    },
})