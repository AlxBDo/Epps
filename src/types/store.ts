import type { AnyObject, SearchCollectionCriteria } from ".";
import type { _StoreWithGetters, PiniaCustomProperties, PiniaCustomStateProperties, Store, StoreDefinition, SubscriptionCallback, SubscriptionCallbackMutationPatchFunction, SubscriptionCallbackMutationPatchObject } from "pinia";
import type { Ref } from "vue";
import ParentStore from "../plugins/parentStore";
import { Comparison } from "./comparison";
import { ParentStoreInterface } from "./epps";


export type AugmentOptionApiStore<TStore, TState> = Store & TStore & TState & OptionApiStore<TState> & PiniaCustomProperties & PiniaCustomStateProperties & _StoreWithGetters<TState>

type CustomStore = Store & PiniaCustomProperties

type OptionApiStore<TState> = {
    $patch: (item: Partial<TState>) => void
    $reset: () => void
    $state: TState
    $subscribe: (callback: SubscriptionCallback<TState>) => void
}

type StdStatePropertyValue = AnyObject | boolean | null | number | string | undefined

export type StatePropertyValue = StdStatePropertyValue
    | Ref<StdStatePropertyValue>
    | StdStatePropertyValue[]
    | Ref<StdStatePropertyValue[]>
    | Ref<StdStatePropertyValue>[]


/**
 * - -- | Collection Store | -- -
 */

export interface CollectionState<T> {
    items: T[]
}

export interface CollectionStoreMethods {
    addItem: (item: AnyObject) => void
    clear: () => void
    getItem: (criteria: SearchCollectionCriteria) => AnyObject | undefined
    getItems: (criteria?: SearchCollectionCriteria, comparisonMode?: Comparison) => AnyObject[]
    removeItem: (item: AnyObject) => void
    setItems: <T>(items: T[]) => void
    updateItem: (updatedItem: AnyObject, oldItem?: AnyObject) => void
}


/**
 * - -- | Persit Store | -- -
 */

export interface PersistedState extends PersistedStoreOptions {
    isLoading?: boolean
}

export interface PersistedStore {
    persistState: () => Promise<void>
    remember: () => Promise<void>
    removePersistedState: () => void
    stateIsEmpty?: () => boolean
    stopWatch: () => void
    watch: () => void
}

export interface PersistedStoreOptions {
    dbName?: string
    excludedKeys?: string[] | Ref<string[]>
    isEncrypted?: boolean | Ref<boolean>
    persist?: boolean | Ref<boolean>
    persistedPropertiesToEncrypt?: string[] | Ref<string[]>
    watchMutation?: boolean | Ref<boolean>
}

type PartialPersistedStore<TStore, TState> = Partial<TStore>
    & Partial<TState>
    & Partial<PersistedState>
    & Partial<PersistedStore>


/**
 * - -- | Extends Store | -- -
 */

export interface ExtendedStoreOptions {
    actionsToExtends?: string[]
    actionsToRename?: Record<string, string>
    parentsStores?: ParentStoreInterface[]
    propertiesToRename?: Record<string, string>
}

export interface ExtendedState extends PersistedStoreOptions {
    actionsToExtends?: string[] | Ref<string[] | undefined>
    isExtended?: boolean | Ref<boolean | undefined>
    isOptionApi?: boolean | Ref<boolean | undefined>
    parentsStores?: () => Store[] | EppsStore<AnyObject, AnyObject>[]
}

export type ExtendedStore<TStore, TState> = TStore & TState & CustomStore & {
    mutationCallback?: (
        mutation: SubscriptionCallbackMutationPatchFunction | SubscriptionCallbackMutationPatchObject<TState>
    ) => void
}


/**
 * EPPS
 */

export type DefineEppsStore<TStore, TState> = (args?: any) => PartialPersistedStore<TStore, TState> & CustomStore

export type DefineEppsStoreOptionApi<TStore, TState> = (args?: any) => PartialPersistedStore<TStore, OptionApiStore<TState>>
    & CustomStore

export type EppsStore<TStore, TState> = ExtendedStore<TStore, TState>
    & PersistedState
    & PersistedStore
    & StoreDefinition<string, AnyObject & TState & PersistedState, AnyObject, TStore & PersistedStore>

export interface EppsStoreOptions extends ExtendedStoreOptions {
    persist?: PersistedStoreOptions
}