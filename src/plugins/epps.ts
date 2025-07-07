import Crypt from "../services/Crypt"
import Persister from "../services/Persister"
import StoreExtension from "../core/StoreExtension"
import StorePersister from "../core/StorePersister"

import type { AllowedKeyPath } from "../types/storage"
import type { PiniaPlugin, PiniaPluginContext, StateTree, Store } from "pinia"
import type { PersistedStore } from "../types/store"
import { log, eppsLogError } from "../utils/log"
import { isEmpty } from "../utils/validation"


export interface EppsConstructorProps {
    dbName?: string
    dbKeyPath?: AllowedKeyPath
    cryptKey?: string
    debug?: boolean
}

export class Epps {
    private _db?: Persister
    private _debug: boolean = false
    private _crypt?: Crypt
    private _watchedStore: string[] = []


    get db(): Persister | undefined { return this._db }

    get crypt(): Crypt | undefined { return this._crypt }

    constructor(db?: Persister, crypt?: Crypt, debug: boolean = false) {
        this._debug = debug

        if (db instanceof Persister) {
            this._db = db
        }

        if (crypt) { this._crypt = crypt }
    }

    plugin(context: PiniaPluginContext) {
        try {
            const { store } = context

            new StoreExtension(store, this._debug)

            if (this.db instanceof Persister) {
                new StorePersister(store, this.db, this._watchedStore, this._crypt, this._debug)
            }

            this.rewriteResetStore(context, Object.assign({}, store.$state))
        } catch (e) {
            eppsLogError('plugin()', [e, context])
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

            eppsLogError(
                'Since version 0.2.00, the encryption service has been modified and requires all encrypted data in localStorage or IndexedDB to be deleted.',
                ['Delete the keys corresponding to stores where one or more state data are encrypted, so that they can be correctly persisted again.']
            )
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