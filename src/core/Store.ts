import { ref, type Ref } from "vue"
import Crypt from "../services/Crypt"
import Persister from "../services/Persister"

import type { Store as PiniaStore, StateTree } from "pinia"
import type { AnyObject, EppsStore } from "../types"
import type { StatePropertyValue } from "../types/store"


export default class Store {
    protected _crypt?: Crypt

    protected _persister?: Persister

    private _statePropertiesNotToPersist: string[] = [
        '@context',
        'activeLink',
        'computed',
        'dep',
        'excludedKeys',
        'fn',
        'isEncrypted',
        'isLoading',
        'persist',
        'persistedPropertiesToEncrypt',
        'subs',
        'version',
        'watchMutation'
    ]

    private _store: PiniaStore

    protected _watchedStore?: string[]


    get parentsStores(): EppsStore<AnyObject, AnyObject>[] | undefined {
        return typeof this.store.parentsStores === 'function' && this.store.parentsStores()
    }

    get state(): StateTree { return this._store.$state }

    set state(state: StateTree) { this._store.$state = state }

    get store(): AnyObject { return this._store }

    set store(store: PiniaStore) { this._store = store }


    constructor(store: PiniaStore, persister?: Persister, watchedStore?: string[], crypt?: Crypt) {
        this._store = store
        this._watchedStore = watchedStore ?? []

        if (persister) { this._persister = persister }

        if (crypt) { this._crypt = crypt }
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
    }

    getStatePropertyToNotPersist(): string[] {
        return [
            ...this._statePropertiesNotToPersist,
            ...(this.getStatePropertyValue('excludedKeys') ?? [])
        ]
    }

    getStatePropertyValue(propertyName: string) {
        return this.getValue(this.state[propertyName])
    }

    getStoreName(): string {
        return this.store.hasOwnProperty('getStoreName') ? this.store.getStoreName() : this.store.$id
    }

    getValue(value: StatePropertyValue) {
        return (value as Ref)?.value ?? value
    }

    hasParentsStores(): boolean {
        return Array.isArray(this.parentsStores) && !!this.parentsStores.length
    }

    hasPersistProperty(): boolean { return this.state.hasOwnProperty('persist') }

    isOptionApi(): boolean { return this.store._isOptionsAPI }

    executeToParentsStore(methodName: string): void {
        if (!this.hasParentsStores()) { return }

        this.parentsStores?.forEach(
            (parentStore: EppsStore<AnyObject, AnyObject>) => typeof parentStore[methodName] === 'function'
                && parentStore[methodName]()
        )
    }

    shouldBePersisted(): boolean {
        return this.hasPersistProperty() && this.getStatePropertyValue('persist')
    }

    stateHas(property: string): boolean { return this.state.hasOwnProperty(property) }

    storeHas(property: string): boolean { return this.store.hasOwnProperty(property) }
}