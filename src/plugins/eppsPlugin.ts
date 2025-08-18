import Crypt from "../services/Crypt"
import { eppsLog, eppsLogError } from "../utils/log"
import Persister from "../services/Persister"
import StoreExtension from "../core/StoreExtension"
import StorePersister from "../core/StorePersister"

import type { AllowedKeyPath } from "../types/storage"
import type { PiniaPluginContext, StateTree, Store } from "pinia"


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

    private eppsStoreNotDefinedByOptions({ store, options }: PiniaPluginContext) {
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

    plugin(context: PiniaPluginContext) {
        try {
            // TODO - à supprimer
            this.eppsStoreNotDefinedByOptions(context)

            const { store, options } = context

            new StoreExtension(store, options, this._debug)

            if (this.db instanceof Persister) {
                new StorePersister(store, options, this.db, this._watchedStore, this._crypt, this._debug)
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