import Crypt from "../services/Crypt"
import { EppsPlugin } from "./eppsPlugin"
import { isEmpty } from "../utils/validation"
import Persister from "../services/Persister"

import type { PiniaPlugin } from "pinia"
import type { EppsStoreOptions } from "../types/store"
import type { PersistedStore } from "../types"


export function createPlugin(dbName?: string, cryptKey?: string, debug: boolean = false): PiniaPlugin {
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

    const eppsPlugin = new EppsPlugin(db, crypt, debug)

    return eppsPlugin.plugin.bind(eppsPlugin)
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }

    export interface DefineStoreOptionsBase<S, Store> extends EppsStoreOptions {
    }
}