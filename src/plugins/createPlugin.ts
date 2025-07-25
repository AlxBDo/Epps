import { PiniaPlugin } from "pinia"
import Crypt from "../services/Crypt"
import { Epps } from "./epps"
import { eppsLogError } from "../utils/log"
import { isEmpty } from "../utils/validation"
import Persister from "../services/Persister"

import type { PersistedStore } from "../types"


export function createPlugin(dbName?: string, cryptKey?: string, debug: boolean = false): PiniaPlugin {
    if (window) {
        const db = (!isEmpty(dbName) && dbName)
            ? new Persister({ name: dbName, keyPath: 'storeName' })
            : undefined

        let crypt: Crypt | undefined

        if (cryptKey) {
            crypt = new Crypt(cryptKey)
        }

        if (typeof debug !== 'boolean') {
            debug = false
        }

        const augmentPinia = new Epps(db, crypt, debug)

        return augmentPinia.plugin.bind(augmentPinia)
    }

    return () => ({})
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }
}