import Crypt from "../services/Crypt"
import { EppsPlugin } from "./eppsPlugin"
import { isEmpty } from "../utils/validation"
import Persister from "../services/Persister"

import type { PiniaPlugin } from "pinia"
import type { EppsStoreOptions } from "../types/store"
import type { PersistedStore } from "../types"


export function createPlugin(dbName?: string, cryptKey?: string, debug: boolean = false): PiniaPlugin {
    const { db, crypt } = getEppsPluginOptions(dbName, cryptKey)

    if (typeof debug !== 'boolean') {
        debug = false
    }

    const eppsPlugin = new EppsPlugin(db, crypt, debug)

    return eppsPlugin.plugin.bind(eppsPlugin)
}

function getEppsPluginOptions(dbName?: string, cryptKey?: string) {
    let db: Persister | undefined
    let crypt: Crypt | undefined

    try {
        if (window) {
            if (!isEmpty(dbName) && dbName) {
                db = new Persister({ name: dbName, keyPath: 'storeName' })
            }

            if (cryptKey) {
                crypt = new Crypt(cryptKey)
            }

            return { db, crypt }
        }
    } catch (e) { }

    return { db, crypt }
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }

    export interface DefineStoreOptionsBase<S, Store> extends EppsStoreOptions {
    }
}