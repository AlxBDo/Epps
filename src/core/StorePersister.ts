import { toRaw } from "vue"
import { areIdentical } from "../utils/validation/object"
import Crypt from "../services/Crypt"
import { isEmpty } from "../utils/validation"
import { log, logError } from "../utils/log"
import Persister from "../services/Persister"
import Store from "./Store"

import type { Store as PiniaStore, StateTree, SubscriptionCallbackMutation } from "pinia"
import type { AnyObject } from "../types"


export default class StorePersister extends Store {
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

    constructor(store: PiniaStore, persister: Persister, watchedStore: string[], crypt?: Crypt) {
        if (!(persister instanceof Persister)) {
            throw new Error('StorePersister must be instanciated with a Persister')
        }

        super(store)

        this._persister = persister
        this._watchedStore = watchedStore ?? []

        if (crypt) { this._crypt = crypt }

        if (this.hasPersistProperty()) {
            this.augmentStore()
            this.remember()

            if (this.toBeWatched()) {
                this.storeSubscription()
            }
        }
    }


    augmentStore() {
        // Augment state
        if (!this.stateHas('isEncrypted')) { this.addToState('isEncrypted', false) }
        if (!this.stateHas('persist')) { this.addToState('persist', false) }
        if (!this.stateHas('persistedPropertiesToEncrypt')) { this.addToState('persistedPropertiesToEncrypt', []) }
        if (!this.stateHas('watchMutation')) { this.addToState('watchMutation', false) }


        // Augment Store
        this.store.persistState = () => this.persist()
        this.store.remember = async () => this.remember()
        this.store.removePersistedState = () => (this._persister as Persister).removeItem(this.getStoreName())
        this.store.watch = () => {
            if (this.toBeWatched()) {
                this.addToState('watchMutation', true)
                this.storeSubscription()
            }
        }
        this.store.stopWatch = () => this.stopWatch()
    }

    cryptState(state: StateTree, decrypt: boolean = false): StateTree {
        const Crypt = this._crypt as Crypt
        const persistedPropertiesToEncrypt = this.getValue(state.persistedPropertiesToEncrypt)
        const isEncrypted = this.getValue(state.isEncrypted)

        if (
            Array.isArray(persistedPropertiesToEncrypt) && persistedPropertiesToEncrypt.length > 0
            && isEncrypted === decrypt && Crypt
        ) {
            const encryptedState = {} as StateTree

            persistedPropertiesToEncrypt.forEach((property: string) => {

                if (state[property]) {
                    const value = this.getValue(state[property])
                    encryptedState[property] = decrypt ? Crypt.decrypt(value) : Crypt.encrypt(value)
                }
            })

            state = { ...state, ...encryptedState, isEncrypted: !decrypt }
        }

        return state
    }

    async getPersistedState(): Promise<StateTree | undefined> {
        const storeName = this.getStoreName()

        try {
            let persistedState = await (this._persister as Persister).getItem(storeName) as StateTree

            if (this.toBeCrypted() && persistedState) {
                persistedState = this.cryptState({ ...toRaw(this.state), ...persistedState, isEncrypted: true }, true)
            }

            return persistedState
        } catch (e) {
            logError('getPersistedState Error', [storeName, e])
        }
    }

    getStatePropertyToNotPersist(): string[] {
        return [
            ...this._statePropertiesNotToPersist,
            ...(this.getStatePropertyValue('excludedKeys') ?? [])
        ]
    }

    hasPersistProperty(): boolean { return this.state.hasOwnProperty('persist') }

    async persist() {
        let persistedState = await this.getPersistedState()
        let state = this.state

        if (this.toBeCrypted()) {
            state = this.cryptState(state)
            if (persistedState) { persistedState = this.cryptState(persistedState) }
        }

        const newState = this.populateState(state, persistedState)

        /** 
            log(
                `persistStore persist ${this.getStoreName()}`,
                [
                    'areIdentical',
                    areIdentical(newState, persistedState ?? {}, this.getStatePropertyToNotPersist()),
                    'newState',
                    newState,
                    'persistedState',
                    persistedState,
                    'state',
                    state,
                    'store',
                    this.store
                ]
            )
         */

        if (isEmpty(newState) || this.stateIsEmpty(newState)) { return }

        if (!persistedState || !areIdentical(newState, persistedState, this.getStatePropertyToNotPersist())) {

            (this._persister as Persister).setItem(this.getStoreName(), newState)
        }
    }

    populateState(state: StateTree, persistedState?: StateTree) {
        const excludedKeys = this.getStatePropertyToNotPersist()

        const deniedFirstChar = ['_', '$']

        return Object.keys(state).reduce((acc: StateTree, curr: string) => {

            if (!deniedFirstChar.includes(curr[0]) && !excludedKeys.includes(curr)) {
                const stateValue = this.getValue(state[curr])
                const persistedStateValue = persistedState && this.getValue(persistedState[curr])

                if (!stateValue && persistedStateValue) {
                    acc[curr] = persistedStateValue
                } else {
                    if (Array.isArray(stateValue)) {
                        acc[curr] = stateValue.map(
                            (item: any) => typeof item === "object" ? this.populateState(item) : toRaw(item)
                        )
                    } else if (typeof stateValue === 'object') {
                        acc[curr] = this.populateState(stateValue, persistedStateValue)
                    } else {
                        acc[curr] = toRaw(stateValue ?? persistedStateValue)
                    }
                }
            }
            return acc
        }, {} as StateTree)
    }

    propertyShouldBePersisted(property: string): boolean {
        return !this.getStatePropertyToNotPersist().includes(property)
    }

    private async remember() {
        const persistedState = await this.getPersistedState()

        if (persistedState && !this.stateIsEmpty(persistedState)) {
            this.store.$patch(persistedState)
        }
    }

    shouldBePersisted(): boolean {
        return this.hasPersistProperty() && this.getStatePropertyValue('persist')
    }

    private stateIsEmpty(state: AnyObject): boolean {
        return this.store?.stateIsEmpty && this.store?.stateIsEmpty(state)
    }

    private stopWatch() {
        if (this.getStatePropertyValue('watchMutation')) {
            this.addToState('watchMutation', false)
        }
    }

    private storeSubscription() {
        if (!this.toBeWatched()) {
            return
        }

        (this._watchedStore as string[]).push(this.getStoreName())

        this.store.$subscribe((mutation: SubscriptionCallbackMutation<StateTree>, state: StateTree) => {
            if (mutation.type !== 'patch object' && mutation?.events && this.getStatePropertyValue('watchMutation')) {

                const { newValue, oldValue } = mutation.events as AnyObject

                if (!newValue || typeof newValue === 'function' || newValue === 'excludedKeys') {
                    return
                }

                this.persist()

                if (
                    (typeof newValue === 'object' ? !areIdentical(newValue, oldValue) : newValue !== oldValue)
                    && typeof this.store.mutationCallback === 'function'
                ) {
                    this.store.mutationCallback(mutation)
                }
            }
        })
    }

    toBeCrypted(): boolean {
        return !!(this._crypt && this.state.hasOwnProperty('persistedPropertiesToEncrypt'))
    }

    toBeWatched(): boolean {
        return this.shouldBePersisted()
            && !(this._watchedStore as string[]).includes(this.getStoreName())
    }
}