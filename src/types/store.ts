import type { AnyObject, SearchCollectionCriteria } from ".";
import type { _StoreWithGetters, PiniaCustomProperties, PiniaCustomStateProperties, Store, SubscriptionCallback } from "pinia";
import type { PersistOptions } from "../plugins/pinia/extendsStore/extendedState";
import type { Ref } from "vue";


export type AugmentStore<T> = Store & T

export type AugmentOptionApiStore<TStore, TState> = Store & TStore & TState & OptionApiStore<TState> & PiniaCustomProperties & PiniaCustomStateProperties & _StoreWithGetters<TState>

type OptionApiStore<TState> = {
    $patch: (item: Partial<TState>) => void
    $reset: () => void
    $state: TState
    $subscribe: (callback: SubscriptionCallback<TState>) => void
}

export interface CollectionState<T> {
    items: T[];
}

export interface CollectionStoreMethods {
    addItem: (item: AnyObject) => void
    getItem: (criteria: SearchCollectionCriteria) => AnyObject | undefined
    getItems: (criteria?: SearchCollectionCriteria) => AnyObject[]
    removeItem: (item: AnyObject) => void
    setItems: <T>(items: T[]) => void
    updateItem: (updatedItem: AnyObject, oldItem?: AnyObject) => void
}


/**
 * - -- | Persit Store | -- -
 */

export interface PersistedState {
    excludedKeys?: string[]
    isEncrypted?: boolean
    isLoading?: boolean
    persist: boolean
    persistedPropertiesToEncrypt?: string[]
    watchMutation?: boolean
}

export interface PersistedStore {
    persistState: () => void
    remember: () => Promise<void>
    removePersistedState: () => void
    watch: () => void
}


/**
 * - -- | Extends Store | -- -
 */

export interface ExtendedState extends PersistOptions {
    actionsToExtends?: string[] | Ref<string[] | undefined>
    isExtended?: boolean | Ref<boolean | undefined>
    isOptionApi?: boolean | Ref<boolean | undefined>
    parentsStores?: Store[] | Ref<Store[]>
}

export type ExtendState<T, I> = T & I & ExtendedState

export type DefineExtendedStore<TStore, TState> = (args?: any) => Store & TStore & TState & PiniaCustomProperties

export type DefineExtendedStoreOptionApi<TStore, TState> = (args?: any) => Store & TStore & TState & PiniaCustomProperties & OptionApiStore<TState>

export type ExtendedStore<TStore, TState> = Store & TStore & TState & PiniaCustomProperties