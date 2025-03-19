export interface AnyObject { [key: number | string | symbol]: any };

export interface SearchCollectionCriteria { [key: number | string | symbol]: boolean | number | string }

export type {
    AugmentOptionApiStore,
    AugmentStore,
    CollectionState,
    CollectionStoreMethods,
    DefineEppsStore,
    DefineExtendedStore,
    DefineExtendedStoreOptionApi,
    EppsStore,
    ExtendState,
    ExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";