import { toRaw } from "vue"
import { areIdentical } from "../utils/validation/object"
import Crypt from "../services/Crypt"
import { isEmpty } from "../utils/validation"
import { eppsLogError } from "../utils/log"
import Persister from "../services/Persister"
import Store from "./Store"

import type { Store as PiniaStore, StateTree, SubscriptionCallbackMutation } from "pinia"
import type { AnyObject } from "../types"
import type { EppsStoreOptions } from "../types/store"


export default class StorePersister extends Store {
    protected _crypt?: Crypt

    protected _persister?: Persister

    private _statePropertiesNotToPersist: string[] = [
        '@context',
        'actionsToExtends',
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

    constructor(
        store: PiniaStore,
        options: EppsStoreOptions,
        persister: Persister,
        watchedStore: string[],
        crypt?: Crypt,
        debug: boolean = false
    ) {
        super(store, options, debug)

        this._persister = persister
        this._watchedStore = watchedStore ?? []

        if (crypt) {
            this._crypt = crypt

            if (this.options?.persist) {
                this.options.persist.isEncrypted = false
            }
        }
        if (this.hasPersistProperty()) {
            this.augmentStore()
            this.remember()

            this.debugLog('StorePersister constructor', [
                this.toBeWatched(), watchedStore, persister, this.options, store
            ])

            if (this.toBeWatched()) {
                this.storeSubscription()
            }
        }
    }


    augmentStore() {
        // Augment state
        if (this.options?.persist) {
            const { isEncrypted, persist, persistedPropertiesToEncrypt, watchMutation } = this.options.persist
            if (isEncrypted === undefined) { this.options.persist.isEncrypted = false }
            if (persist === undefined) { this.options.persist.persist = !!this.options.persist.watchMutation }
            if (persistedPropertiesToEncrypt === undefined) { this.options.persist.persistedPropertiesToEncrypt = [] }
            if (watchMutation === undefined) { this.options.persist.watchMutation = false }
        } else {
            if (!this.stateHas('persist')) { this.addToState('persist', false) }
            if (!this.stateHas('persistedPropertiesToEncrypt')) { this.addToState('persistedPropertiesToEncrypt', []) }
            if (!this.stateHas('watchMutation')) { this.addToState('watchMutation', false) }
            if (!this.stateHas('isEncrypted')) { this.addToState('isEncrypted', false) }
        }
        if (!this.stateHas('isLoading')) { this.addToState('isLoading', false) }


        // Augment Store
        this.store.persistState = async () => await this.persist()
        this.store.remember = async () => await this.remember()
        this.store.removePersistedState = () => (this._persister as Persister).removeItem(this.getStoreName())
        this.store.watch = () => {
            if (this.toBeWatched()) {
                if (this.options?.persist) {
                    this.options.persist.watchMutation = true
                } else {
                    this.addToState('watchMutation', true)
                }

                this.storeSubscription()
            }
        }
        this.store.stopWatch = () => this.stopWatch()
    }

    async cryptState(state: StateTree, decrypt: boolean = false): Promise<StateTree> {
        return await new Promise(async (resolve) => {
            const Crypt = this._crypt as Crypt
            const persistedPropertiesToEncrypt = this.getPropertiesToEncrypt()
            const isEncrypted = this.isEncrypted(state)

            this.debugLog(`cryptState - ${this.getStoreName()} ${decrypt ? 'decrypt' : 'crypt'}`, [
                'can',
                Array.isArray(persistedPropertiesToEncrypt) && persistedPropertiesToEncrypt.length > 0
                && isEncrypted === decrypt && !!Crypt,
                [
                    Array.isArray(persistedPropertiesToEncrypt) && persistedPropertiesToEncrypt.length > 0,
                    Crypt
                ],
                state
            ])

            if (
                Array.isArray(persistedPropertiesToEncrypt) && persistedPropertiesToEncrypt.length > 0
                && Crypt
            ) {
                const encryptedState = {} as StateTree

                for (const property of persistedPropertiesToEncrypt) {
                    const value = this.getValue(state[property])

                    if (value) {
                        if (decrypt) {

                            // TODO - remove soon 
                            // Need for Crypt changing : remove crypto-js dependence
                            if ((value as string).indexOf(':') < 1) {
                                this.store.removePersistedState()
                                return resolve({})
                            }

                            encryptedState[property] = await Crypt.decrypt(value)
                        } else {
                            encryptedState[property] = await Crypt.encrypt(value)
                        }
                    }
                }

                this.debugLog(`cryptState - ${this.getStoreName()}`, [
                    'encryptedState',
                    encryptedState
                ])

                if (!isEmpty(encryptedState)) {
                    state = { ...state, ...encryptedState }

                    if (this.options?.persist) {
                        this.options.persist.isEncrypted = !decrypt
                    } else {
                        state.isEncrypted = !decrypt
                    }
                }
            }

            resolve(state)
        })
    }

    private isEncrypted(state?: AnyObject) {
        return (this.options?.persist && this.options.persist.isEncrypted)
            ?? this.getValue(state ? state.isEncrypted : this.state.isEncrypted)
    }

    private getPropertiesToEncrypt() {
        return (this.options?.persist && this.options.persist?.persistedPropertiesToEncrypt)
            ?? this.state.hasOwnProperty('persistedPropertiesToEncrypt')
    }

    async getPersistedState(decrypt: boolean = true): Promise<StateTree | undefined> {
        const storeName = this.getStoreName()

        try {
            let persistedState = await (this._persister as Persister).getItem(storeName) as StateTree

            if (decrypt && this.toBeCrypted() && persistedState) {
                await this._crypt?.init()
                persistedState = await this.cryptState({ ...toRaw(this.state), ...persistedState }, true)
            }

            this.debugLog(`getPersistedState ${storeName}`, [persistedState, this.state])

            return persistedState
        } catch (e) {
            eppsLogError('getPersistedState Error', [storeName, e])
        }
    }

    getStatePropertyToNotPersist(): string[] {
        return [
            ...this._statePropertiesNotToPersist,
            ...(
                (this.options?.persist && this.options.persist.excludedKeys)
                ?? this.getStatePropertyValue('excludedKeys')
                ?? []
            )
        ]
    }

    private getWatchMutation() {
        return (this.options?.persist && this.options.persist.watchMutation) ?? this.getStatePropertyValue('watchMutation')
    }

    hasPersistProperty(): boolean { return !!(this.options && this.options.persist) || this.state.hasOwnProperty('persist') }

    async persist() {
        let persistedState = await this.getPersistedState()
        let state = this.state

        if (this.toBeCrypted()) {
            await this._crypt?.init()
            state = await this.cryptState(state)
        }

        const newState = this.populateState(state, persistedState)

        this.debugLog(
            `persistStore persist ${this.getStoreName()}`,
            [
                'toBeCrypted',
                this.toBeCrypted(),
                'areIdentical',
                areIdentical(newState, persistedState ?? {}, this.getStatePropertyToNotPersist()),
                'newState',
                newState,
                'persistedState',
                persistedState,
                'state',
                state,
                'store',
                this.store,
                'Crypt',
                this._crypt
            ]
        )

        if (isEmpty(newState) || (this.stateIsEmpty && this.stateIsEmpty(newState))) { return }

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

                if (isEmpty(stateValue) && persistedStateValue) {
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
        this.state.isLoading = true
        return new Promise(async (resolve) => {
            let persistedState = await this.getPersistedState()

            if (persistedState && !this.stateIsEmpty(persistedState)) {
                this.store.$patch(persistedState)
            }

            this.state.isLoading = false

            return resolve(true)
        })
    }

    shouldBePersisted(): boolean {
        return this.hasPersistProperty() && (this.options?.persist?.persist ?? this.getStatePropertyValue('persist'))
    }

    private stateIsEmpty(state: AnyObject): boolean {
        return this.store?.stateIsEmpty && this.store?.stateIsEmpty(state)
    }

    private stopWatch() {
        if (this.options?.persist && this.options.persist?.watchMutation) {
            this.options.persist.watchMutation = false
        } else if (this.getStatePropertyValue('watchMutation')) {
            this.addToState('watchMutation', false)
        }
    }

    private storeSubscription() {
        this.debugLog(`storeSubscription ${this.getStoreName()}`, [this.toBeWatched(), this.state, this.store])

        if (!this.toBeWatched()) {
            return
        }

        (this._watchedStore as string[]).push(this.getStoreName())

        this.store.$subscribe((mutation: SubscriptionCallbackMutation<StateTree>) => {
            this.debugLog(`store.$subscribe ${this.getStoreName()}`, [
                mutation.type !== 'patch object', this.getWatchMutation(),
                mutation, this.state, this.store
            ])

            if (mutation.type !== 'patch object' && this.getWatchMutation()) {
                this.persist().then(() => {
                    if (this.store.mutationCallback) {
                        this.store.mutationCallback(this.state, mutation)
                    }
                })
            }
        })
    }

    toBeCrypted(): boolean {
        return !!(this._crypt && this.getPropertiesToEncrypt())
    }

    toBeWatched(): boolean {
        return this.shouldBePersisted()
            && !(this._watchedStore as string[]).includes(this.getStoreName())
    }
}