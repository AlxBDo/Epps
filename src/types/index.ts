export interface AnyObject {
    [key: number | string | symbol]: any;
}
export interface SearchCollectionCriteria {
    [key: number | string | symbol]: boolean | number | string;
}

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

export type { ErrorsState, ErrorsStore } from '../stores/errors'

export type { ResourceIdStore } from '../stores/resourceId'

export type { Item as ResourceIdState } from '../models/item'

export type { WebUserState, WebUserStore } from '../stores/webuser'