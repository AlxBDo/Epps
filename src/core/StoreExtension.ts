import { computed, toRef } from "vue";
import Store from "./Store";

import type { AnyObject } from "../types";
import type { Store as PiniaStore } from "pinia";
import { log } from "../utils/log";


export default class StoreExtension extends Store {
    private _extendedActions: string[] = ['removePersistedState', 'watch', '$reset']


    constructor(store: PiniaStore, debug: boolean = false) {
        super(store, debug)

        this.extendsStore()
    }


    get extendedActions(): string[] {
        return [...this._extendedActions, ...(this.getStatePropertyValue('actionsToExtends') ?? [])]
    }

    private addToCustomProperties(propertyName: string): void {
        if (!import.meta.env.PROD) {
            this.store._customProperties.add(propertyName)
        }
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
    private duplicateStore(storeToExtend: AnyObject): void {
        const deniedFirstChars = ['$', '_']

        Object.keys(storeToExtend).forEach((key: string) => {
            if (deniedFirstChars.includes(key[0]) && key !== '$reset') { return }

            const typeOfProperty = typeof storeToExtend[key]

            if (typeOfProperty === 'function') {
                if (this.storeHas(key)) {
                    if (this.extendedActions.includes(key)) { this.extendsAction(storeToExtend, key) }
                } else {
                    this.store[key] = storeToExtend[key]
                    this.addToCustomProperties(key)
                }
            } else if (!this.storeHas(key) && (typeOfProperty === 'undefined' || typeOfProperty === 'object')) {
                this.store[key] = this.createComputed(storeToExtend, key)
                this.addToCustomProperties(key)
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
                this.store[key] = this.state[key] = toRef(storeToExtend.$state, key)
                this.addToCustomProperties(key)
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
                    this.duplicateStore(ste)
                    this.extendsState(ste)
                }
            })

            this.addToState('isExtended', true)
        }
    }
}