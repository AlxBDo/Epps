import { toRaw } from "vue"
import Crypt from "../services/Crypt"
import { isEmpty } from "../utils/validation"
import { eppsLogError } from "../utils/log"
import Persister from "../services/Persister"
import Store from "./Store"

import type { Store as PiniaStore, StateTree, SubscriptionCallbackMutation } from "pinia"
import type { AnyObject } from "../types"
import type { EppsStoreOptions, PersistedStoreOptions } from "../types/store"

const statePropertiesNotToPersist: string[] = [
    '@context',
    'activeLink',
    'computed',
    'dep',
    'excludedKeys',
    'fn',
    'isEncrypted',
    'isLoading',
    'subs',
    'version'
]


export default class StorePersister extends Store {
    protected _crypt?: Crypt

    private _excludedKeys: Set<string>

    protected _persister?: Persister

    private _propertiesToEncrypt: Set<string>

    private _watchedStore: Set<string>

    constructor(
        store: PiniaStore,
        options: EppsStoreOptions,
        persister: Persister,
        watchedStore: Set<string>,
        crypt?: Crypt,
        debug: boolean = false
    ) {
        super(store, options, debug)

        this._excludedKeys = this.initExcludedKeys()
        this._persister = persister
        this._propertiesToEncrypt = new Set<string>(this.getPropertiesToEncrypt())
        this._watchedStore = watchedStore

        if (crypt) {
            this._crypt = crypt

            if (this.options?.persist) {
                (this.options.persist as PersistedStoreOptions).isEncrypted = false
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
            const { persist } = this.options
            const { isEncrypted, persistedPropertiesToEncrypt, watchMutation } = typeof persist === 'object' ? persist : {}
            if (isEncrypted === undefined) { (this.options.persist as PersistedStoreOptions).isEncrypted = false }
            if (persistedPropertiesToEncrypt === undefined) { (this.options.persist as PersistedStoreOptions).persistedPropertiesToEncrypt = [] }
            if (watchMutation === undefined) { (this.options.persist as PersistedStoreOptions).watchMutation = false }
        }

        if (!this.stateHas('isLoading')) { this.addToState('isLoading', false) }


        // Augment Store
        this.store.persistState = async () => await this.persist()
        this.store.remember = async () => await this.remember()
        this.store.removePersistedState = () => (this._persister as Persister).removeItem(this.getStoreName())
        this.store.watch = () => {
            if (this.toBeWatched()) {
                if (this.options?.persist) {
                    (this.options.persist as PersistedStoreOptions).watchMutation = true
                } else {
                    this.addToState('watchMutation', true)
                }

                this.storeSubscription()
            }
        }
        this.store.stopWatch = () => this.stopWatch()
    }

    private async cryptProperty(crypt: Crypt, value: string, decrypt: boolean = false): Promise<string> {
        if (decrypt) {
            return await crypt.decrypt(value)
        } else {
            return await crypt.encrypt(value)
        }
    }

    async cryptState(state: StateTree, decrypt: boolean = false): Promise<StateTree> {
        return await new Promise(async (resolve) => {
            const Crypt = this._crypt as Crypt
            const persistedPropertiesToEncrypt = this.getPropertiesToEncrypt()
            const isEncrypted = this.isEncrypted(state)

            this.debugLog(`cryptState - ${this.getStoreName()} ${decrypt ? 'decrypt' : 'crypt'}`, [
                'can',
                this._propertiesToEncrypt.size > 0
                && isEncrypted === decrypt && !!Crypt,
                Crypt,
                state
            ])

            if (this._propertiesToEncrypt.size > 0 && Crypt) {
                const encryptedState = {} as StateTree

                for (const property of persistedPropertiesToEncrypt) {
                    const value = this.getValue(state[property])

                    if (value) {
                        encryptedState[property] = await this.cryptProperty(Crypt, value, decrypt)
                    }
                }

                this.debugLog(`cryptState - ${this.getStoreName()}`, [
                    'encryptedState',
                    encryptedState
                ])

                if (!isEmpty(encryptedState)) {
                    state = { ...state, ...encryptedState }

                    if (this.options?.persist) {
                        (this.options.persist as PersistedStoreOptions).isEncrypted = !decrypt
                    }
                }
            }

            resolve(state)
        })
    }

    private isEncrypted(state?: AnyObject) {
        return (this.options?.persist && (this.options.persist as PersistedStoreOptions).isEncrypted)
            ?? this.getValue(state ? state.isEncrypted : this.state.isEncrypted)
    }

    private getPropertiesToEncrypt(): string[] {
        return ((this.options?.persist && (this.options.persist as PersistedStoreOptions)?.persistedPropertiesToEncrypt) ?? []) as string[]
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

    private async getStateToPersist() {
        const excludedKeys = this._excludedKeys
        const state = this.state
        const hasPropertiesToEncrypt = this._propertiesToEncrypt.size > 0
        const crypt = this._crypt as Crypt

        if (hasPropertiesToEncrypt) {
            await crypt.init()
        }

        const newState = {} as StateTree

        for (const key of Object.keys(state)) {
            if (!this.hasDeniedFirstChar(key[0]) && !excludedKeys.has(key)) {

                const stateValue = state[key]

                if (!isEmpty(stateValue)) {
                    if (hasPropertiesToEncrypt && this._propertiesToEncrypt.has(key)) {
                        newState[key] = await this.cryptProperty(crypt, stateValue, false)
                    } else {
                        newState[key] = toRaw(stateValue)
                    }
                }
            }

        }

        return newState
    }

    private getWatchMutation() {
        return this.options?.persist && (this.options.persist as PersistedStoreOptions).watchMutation
    }

    hasPersistProperty(): boolean { return !!(this.options && this.options.persist) }

    private initExcludedKeys(): Set<string> {
        return new Set<string>([
            ...statePropertiesNotToPersist,
            ...(
                (this.options?.persist && (this.options.persist as PersistedStoreOptions).excludedKeys)
                ?? this.getStatePropertyValue('excludedKeys')
                ?? []
            )
        ])
    }

    async persist() {
        const state = await this.getStateToPersist()

        if (!isEmpty(state)) {
            (this._persister as Persister).setItem(this.getStoreName(), state)
        }
    }

    propertyShouldBePersisted(property: string): boolean {
        return !this._excludedKeys.has(property)
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
        return this.hasPersistProperty()
    }

    private stateIsEmpty(state: AnyObject): boolean {
        return this.store?.stateIsEmpty && this.store?.stateIsEmpty(state)
    }

    private stopWatch() {
        if (this.options?.persist && (this.options.persist as PersistedStoreOptions)?.watchMutation) {
            (this.options.persist as PersistedStoreOptions).watchMutation = false
        }
    }

    private storeSubscription() {
        this.debugLog(`storeSubscription ${this.getStoreName()}`, [this.toBeWatched(), this.state, this.store])

        if (!this.toBeWatched()) {
            return
        }

        this._watchedStore.add(this.getStoreName())

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
            && !this._watchedStore.has(this.getStoreName())
    }
}