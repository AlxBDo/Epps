export interface AnyObject { [key: number | string | symbol]: any };

export interface SearchCollectionCriteria { [key: number | string | symbol]: boolean | number | string }

export type {
    AugmentOptionApiStore,
    CollectionState,
    CollectionStoreMethods,
    DefineEppsStore,
    EppsStore,
    ExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";