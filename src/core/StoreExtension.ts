import { computed } from "vue";
import Crypt from "../services/Crypt";
import Persister from "../services/Persister";
import Store from "./Store";
import StorePersister from "./StorePersister";

import type { AnyObject, EppsStore } from "../types";
import type { Store as PiniaStore } from "pinia";


export default class StoreExtension extends Store {
    private _extendedActions: string[] = ['removePersistedState', 'watch', '$reset']


    constructor(store: PiniaStore, persister?: Persister, watchedStore?: string[], crypt?: Crypt) {
        super(store, persister, watchedStore, crypt)

        this.extendsStore()
    }


    get extendedActions(): string[] {
        return [...this._extendedActions, ...(this.getStatePropertyValue('actionsToExtends') ?? [])]
    }


    private createComputed(store: AnyObject, key: string) {
        const isObject = typeof store[key] === 'object'

        return computed({
            get: () => {
                return this.getValue(store[key])
            },
            set: (value: any) => {
                if (isObject && store[key]?.value) {
                    store[key].value = value
                } else { store[key] = value }
            }
        })
    }

    /**
     * Duplicates storeToExtend to extendedStore
     * @param {AnyObject} storeToExtend 
     */
    duplicateStore(storeToExtend: AnyObject): void {
        const deniedFirstChars = ['$', '_']

        Object.keys(storeToExtend).forEach((key: string) => {
            if (deniedFirstChars.includes(key[0]) && key !== '$reset') { return }

            const typeOfProperty = typeof storeToExtend[key]

            if (typeOfProperty === 'function') {
                if (this.storeHas(key)) {
                    if (this.extendedActions.includes(key)) { this.extendsAction(storeToExtend, key) }
                } else {
                    this.store[key] = storeToExtend[key];
                }
            } else if (!this.storeHas(key) && (typeOfProperty === 'undefined' || typeOfProperty === 'object')) {
                this.store[key] = this.createComputed(storeToExtend, key)
            }
        })
    }

    /**
     * Extends storeToExtend's action to extendedStore
     * @param {AnyObject} storeToExtend 
     * @param {string} key 
     */
    private extendsAction(storeToExtend: AnyObject, key: string): void {
        const originalFunction = this.store[key];

        if (this.isOptionApi()) {
            this.store[key] = function (...args: any[]) {
                storeToExtend[key].apply(this, args);
                originalFunction.apply(this, args);
            }
        } else {
            this.store[key] = (...args: any[]) => {
                storeToExtend[key](...args);
                originalFunction(...args);
            }
        }
    }

    private extendsState(storeToExtend: AnyObject) {
        Object.keys(storeToExtend.$state).forEach((key: string) => {
            if (!this.stateHas(key)) {
                this.store[key] = this.createComputed(storeToExtend.$state, key)
            }
        })
    }

    /**
     * Extends to store stores list in parentsStores property
     */
    private extendsStore(): void {
        if (this.storeHas('parentsStores')) {
            const storeToExtend = this.parentsStores

            if (!storeToExtend || !storeToExtend.length) { return }

            (storeToExtend as PiniaStore[]).forEach((ste: PiniaStore) => {
                if (ste?.$state) {
                    if (this.hasPersistProperty()) {
                        this.persistChildStore(ste as EppsStore<AnyObject, AnyObject>)
                    }

                    this.duplicateStore(ste)
                    this.extendsState(ste)
                }
            })

            this.addToState('isExtended', true)
        }
    }

    /**
     * Add state properties necessary to persist
     * @param {StateTree} state 
     * @param {StateTree} childStoreState 
     */
    private persistChildStore(store: EppsStore<AnyObject, AnyObject>) {
        const parentStore = new Store(store)

        parentStore.addPropertiesToState(
            ['excludedKeys', 'persist', 'persistedPropertiesToEncrypt', 'watchMutation'],
            this.state
        )

        if (this._persister instanceof Persister) {
            new StorePersister(
                parentStore.store as PiniaStore,
                this._persister,
                this._watchedStore ?? [],
                this._crypt
            )
        }

        const parentsStores = typeof store.parentsStores === 'function' && store.parentsStores()

        if (Array.isArray(parentsStores) && parentsStores.length) {
            parentsStores.forEach((parentStore: EppsStore<AnyObject, AnyObject>) => this.persistChildStore(parentStore))
        }
    }
}