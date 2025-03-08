/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CRYPT_KEY: string
    readonly VITE_CRYPT_IV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}