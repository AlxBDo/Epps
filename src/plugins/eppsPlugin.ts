import Crypt from "../services/Crypt"
import { Epps } from "./epps"
import { eppsLogError } from "../utils/log"
import Persister from "../services/Persister"
import StoreExtension from "../core/StoreExtension"
import StorePersister from "../core/StorePersister"
import { addEppsStore } from "./eppsStores"

import type { PiniaPluginContext, StateTree } from "pinia"
import type { AllowedKeyPath } from "../types/storage"
import type { AnyObject } from "../types"


export interface EppsConstructorProps {
    dbName?: string
    dbKeyPath?: AllowedKeyPath
    cryptKey?: string
    debug?: boolean
}

export class EppsPlugin {
    private _db?: Persister
    private _debug: boolean = false
    private _crypt?: Crypt
    private _watchedStore: Set<string> = new Set<string>()


    get db(): Persister | undefined { return this._db }

    get crypt(): Crypt | undefined { return this._crypt }


    constructor(db?: Persister, crypt?: Crypt, debug: boolean = false) {
        this._db = db
        this._debug = debug
        this._crypt = crypt
    }

    private getEppsOptions(storeOptions: AnyObject): Epps | undefined {
        return storeOptions?.eppsOptions
    }

    private getStoreDb(storeOptions: AnyObject): Persister | undefined {
        try {
            if (!window) { return this.db }

            const eppsOptions = this.getEppsOptions(storeOptions)
            if (typeof eppsOptions?.persist === 'object' && eppsOptions.persist.dbName) {
                return new Persister({ name: eppsOptions.persist.dbName as string, keyPath: 'storeName' })
            }
        } catch (e) { }

        return this.db
    }

    plugin({ store, options }: PiniaPluginContext) {
        try {
            new StoreExtension(store, options, this._debug)

            const storeDb = this.getStoreDb(options)

            if (storeDb instanceof Persister) {
                new StorePersister(
                    store,
                    options,
                    storeDb as Persister,
                    this._watchedStore,
                    this._crypt,
                    this._debug
                )
            }

            this.rewriteResetStore({ store } as PiniaPluginContext, Object.assign({}, store.$state))

            addEppsStore(store)
        } catch (e) {
            eppsLogError('plugin()', [e, store, options])
        }
    }

    rewriteResetStore({ store }: PiniaPluginContext, initState: StateTree): void {
        store.$reset = () => {
            if (typeof store?.removePersistedState === 'function') {
                store.removePersistedState()
            }

            Object.keys(initState).forEach((key: string) => {
                store[key] = initState[key]
            })

            store.$patch(JSON.parse(JSON.stringify(initState)))
        }
    }
}