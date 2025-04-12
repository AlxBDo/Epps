import { ref, toRef, type Ref } from "vue"

import type { Store as PiniaStore, StateTree } from "pinia"
import type { AnyObject, EppsStore } from "../types"
import type { StatePropertyValue } from "../types/store"
import { log } from "../utils/log"


export default class Store {
    private _store: PiniaStore

    protected _watchedStore?: string[]


    get parentsStores(): EppsStore<AnyObject, AnyObject>[] | undefined {
        return typeof this.store.parentsStores === 'function' && this.store.parentsStores()
    }

    get state(): StateTree { return this._store.$state }

    set state(state: StateTree) { this._store.$state = state }

    get store(): AnyObject { return this._store }


    constructor(store: PiniaStore) {
        this._store = store
    }


    /**
     * Add properties to state
     * @param {string[]} properties 
     * @param {AnyObject|undefined} values 
     */
    addPropertiesToState(
        properties: string[],
        values?: AnyObject
    ): void {
        properties.forEach(
            (property: string) => this.addToState(property, values ? values[property] : undefined)
        )
    }

    /**
     * Add property to state
     * @param name 
     * @param value 
     */
    addToState(name: string, value?: StatePropertyValue): void {
        if (!this.isOptionApi()) {
            if (!(value as Ref)?.value) {
                value = ref<StatePropertyValue>(value)
            }
        }

        this.state[name] = value
        this.store[name] = toRef(this.state, name)
    }

    getStatePropertyValue(propertyName: string) {
        return this.getValue(this.state[propertyName])
    }

    getStoreName(): string {
        return this.store.hasOwnProperty('getStoreName') ? this.store.getStoreName() : this.store.$id
    }

    getValue(value: AnyObject) {
        return value?.__v_isRef ? value.value : value
    }

    isOptionApi(): boolean { return this.store._isOptionsAPI }

    stateHas(property: string): boolean { return this.state.hasOwnProperty(property) }

    storeHas(property: string): boolean { return this.store.hasOwnProperty(property) }
}