import { ref, toRef, type Ref } from "vue"
import { eppsLog } from "../utils/log"
import { Epps } from "../plugins/epps"
import { DefineEppsStoreOtions } from "../utils/store"

import type { Store as PiniaStore, StateTree } from "pinia"
import type { AnyObject, EppsStore } from "../types"
import type { EppsStoreOptions, StatePropertyValue } from "../types/store"


export default class Store {
    private _debug: boolean = false
    private _options?: DefineEppsStoreOtions | Epps
    private _store: PiniaStore
    protected _watchedStore?: string[]

    get debug(): boolean { return this._debug }
    set debug(debug: boolean) { this._debug = debug }

    get options(): EppsStoreOptions | Epps | undefined { return this._options }

    get parentsStores(): EppsStore<AnyObject, AnyObject>[] | undefined {
        this.debugLog(`Store.parentsStore - ${this.getStoreName()}`, this.options)

        if (this.options instanceof Epps || typeof (this.options as unknown as Epps)?.buildStores === 'function') {
            (this.options as Epps).childId = this.store.$id

            this.debugLog(`Store.parentsStore EppsOptions - ${this.getStoreName()}`, [
                (this.options as Epps).childId,
                (this.options as Epps).parentsStores(),
                this.options
            ])

            return (this.options as Epps).parentsStores()
        }

        return typeof this.store.parentsStores === 'function' && this.store.parentsStores()
    }

    get state(): StateTree { return this._store.$state }

    set state(state: StateTree) { this._store.$state = state }

    get store(): AnyObject { return this._store }


    constructor(store: PiniaStore, options: DefineEppsStoreOtions, debug: boolean = false) {
        this._debug = debug
        this._options = options?.eppsOptions ?? options
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

    debugLog(message: string, args: any): void {
        if (this._debug) { eppsLog(message, args) }
    }

    getOption(optionName: keyof EppsStoreOptions | keyof EppsStoreOptions['persist']) {
        return this.options && (this.options as EppsStoreOptions)[optionName]
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