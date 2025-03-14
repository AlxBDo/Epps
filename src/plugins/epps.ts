import Crypt from "../services/Crypt"
import { extendsStore } from "./pinia/extendsStore/extendsStore"
import Persister from "../services/Persister"
import { persistStorePlugin } from "./pinia/persistStore/persistStore"
import { rewriteResetStore } from "./pinia/augmentPinia/augmentStore"

import type { AllowedKeyPath } from "../types/storage"
import type { PiniaPluginContext } from "pinia"
import type { PersistedStore } from "../types/store"
import { log, logError } from "../utils/log"


export interface EppsConstructorProps {
    dbName: string
    dbKeyPath?: AllowedKeyPath
    cryptKey?: string
    cryptIv?: string
}

export class Epps {
    private _db: Persister
    private _crypt?: Crypt


    get db(): Persister { return this._db }

    get crypt(): Crypt | undefined { return this._crypt }

    constructor({ dbName, dbKeyPath, cryptIv, cryptKey }: EppsConstructorProps) {
        this._db = new Persister({ name: dbName, keyPath: dbKeyPath })

        if (cryptIv && cryptKey) {
            this._crypt = new Crypt(cryptKey, cryptIv)
        }
    }

    plugin(context: PiniaPluginContext) {
        try {
            const { store } = context

            rewriteResetStore(context, Object.assign({}, store.$state))
            extendsStore(context)
            persistStorePlugin(context, this)
        } catch (e) {
            logError('plugin()', [e, context])
        }
    }
}

export function createPlugin(dbName: string, cryptIv?: string, cryptKey?: string) {
    if (!dbName) {
        new Error('Database name is required')
    }

    const augmentPinia = new Epps({ dbName, cryptIv, cryptKey, dbKeyPath: 'storeName' })

    return augmentPinia.plugin.bind(augmentPinia)
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }
}