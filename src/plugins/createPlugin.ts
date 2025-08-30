import { PiniaPlugin } from "pinia"
import Crypt from "../services/Crypt"
import { EppsPlugin } from "./eppsPlugin"
import { isEmpty } from "../utils/validation"
import Persister from "../services/Persister"

import type { PersistedStore } from "../types"
import { EppsStoreOptions } from "../types/store"


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

        const augmentPinia = new EppsPlugin(db, crypt, debug)

        return augmentPinia.plugin.bind(augmentPinia)
    }

    return () => ({})
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }

    export interface DefineStoreOptionsBase<S, Store> extends EppsStoreOptions {
    }
}