export interface AnyObject { [key: number | string | symbol]: any };

export interface SearchCollectionCriteria { [key: number | string | symbol]: boolean | number | string }

export type {
    AugmentOptionApiStore,
    AugmentStore,
    CollectionState,
    CollectionStoreMethods,
    DefineExtendedStore,
    DefineExtendedStoreOptionApi,
    ExtendState,
    ExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";