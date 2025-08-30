import Crypt from "../services/Crypt"
import { eppsLog, eppsLogError } from "../utils/log"
import Persister from "../services/Persister"
import StoreExtension from "../core/StoreExtension"
import StorePersister from "../core/StorePersister"

import type { AllowedKeyPath } from "../types/storage"
import type { PiniaPluginContext, StateTree, Store } from "pinia"
import { AnyObject, EppsStore } from "../types"
import { Epps } from "./epps"


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

    private eppsStoreNotDefinedByOptions({ store }: PiniaPluginContext) {
        if (Object.keys(store.$state).find(
            key => ['actionsToExtends', 'isExtended', 'parentsStores', 'persist', 'watchMutation'].includes(key)
        )) {
            eppsLogError(
                `Coming soon not maintained : 
${store.$id} use state to define epps store options.`,
                'Configuration of Epps stores has been changed, see documentation : https://main.d1f2uye6dxmhh3.amplifyapp.com/docs/usage'
            )
        }
    }

    private getEppsOptions(storeOptions: AnyObject): Epps | undefined {
        return storeOptions?.eppsOptions
    }

    private getParentsStores({ store, options }: PiniaPluginContext): EppsStore<AnyObject, AnyObject>[] | undefined {
        const eppsOptions = this.getEppsOptions(options)
        if (eppsOptions?.parentsStores) {
            return eppsOptions.getStores(store.$id)
        }
    }

    private getStoreDb(storeOptions: AnyObject): Persister | undefined {
        const eppsOptions = this.getEppsOptions(storeOptions)
        if (eppsOptions?.persist?.dbName) {
            return new Persister({ name: eppsOptions.persist.dbName as string, keyPath: 'storeName' })
        }
    }

    plugin({ store, options }: PiniaPluginContext) {
        try {
            // TODO - à supprimer
            this.eppsStoreNotDefinedByOptions({ store } as PiniaPluginContext)

            new StoreExtension(store, options, this._debug)

            const storeDb = this.getStoreDb(options)

            if (this.db instanceof Persister || storeDb instanceof Persister) {
                new StorePersister(
                    store,
                    options,
                    (storeDb ?? this.db) as Persister,
                    this._watchedStore,
                    this._crypt,
                    this._debug
                )
            }

            this.rewriteResetStore({ store, options } as PiniaPluginContext, Object.assign({}, store.$state))
        } catch (e) {
            eppsLogError('plugin()', [e, store, options])
        }
    }

    rewriteResetStore({ store, options }: PiniaPluginContext, initState: StateTree): void {
        store.$reset = () => {
            if (typeof store?.removePersistedState === 'function') {
                store.removePersistedState()
            }

            const parentsStores = this.getParentsStores({ store, options } as PiniaPluginContext)

            if (Array.isArray(parentsStores) && parentsStores.length) {
                parentsStores.forEach(
                    (parentStore: Store) => parentStore.$reset()
                )
            }

            store.$patch(Object.assign({}, initState))
        }
    }
}