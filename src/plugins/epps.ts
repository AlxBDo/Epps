import Crypt from "../services/Crypt"
import Persister from "../services/Persister"
import StoreExtension from "../core/StoreExtension"
import StorePersister from "../core/StorePersister"

import type { AllowedKeyPath } from "../types/storage"
import type { PiniaPlugin, PiniaPluginContext, StateTree, Store } from "pinia"
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
    private _watchedStore: string[] = []


    get db(): Persister { return this._db }

    get crypt(): Crypt | undefined { return this._crypt }

    constructor(db: Persister, crypt?: Crypt) {
        this._db = db

        if (crypt) { this._crypt = crypt }
    }

    plugin(context: PiniaPluginContext) {
        try {
            const { store } = context

            new StoreExtension(store, this._db, this._watchedStore, this._crypt)
            new StorePersister(store, this._db, this._watchedStore, this._crypt)
            this.rewriteResetStore(context, Object.assign({}, store.$state))
        } catch (e) {
            logError('plugin()', [e, context])
        }
    }

    rewriteResetStore({ store }: PiniaPluginContext, initState: StateTree): void {

        store.$reset = () => {
            if (store.$state.persist) {
                store.removePersistedState()
            }

            const parentsStores = typeof store.parentsStores === 'function' && store.parentsStores()

            if (Array.isArray(parentsStores) && parentsStores.length) {
                parentsStores.forEach(
                    (parentStore: Store) => parentStore.$reset()
                )
            }

            store.$patch(Object.assign({}, initState))
        }
    }
}

export function createPlugin(dbName: string, cryptIv?: string, cryptKey?: string): PiniaPlugin {
    if (!dbName) {
        new Error('Database name is required')
    }

    if (window) {
        const db = new Persister({ name: dbName, keyPath: 'storeName' })
        let crypt: Crypt | undefined

        if (cryptIv && cryptKey) {
            crypt = new Crypt(cryptKey, cryptIv)
        }

        const augmentPinia = new Epps(db, crypt)

        return augmentPinia.plugin.bind(augmentPinia)
    }

    return () => ({})
}

declare module 'pinia' {
    export interface PiniaCustomProperties extends PersistedStore {
    }
}