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
    PersistedStore
} from "./store";

export type { ErrorsState, ErrorsStore } from '../stores/errors'

export type { ResourceIdStore } from '../stores/resourceId'

export type { ResourceId as ResourceIdState } from '../types/resourceId'

export type { WebUserState, WebUserStore } from '../stores/webuser'