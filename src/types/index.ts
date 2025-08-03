import { PiniaPlugin, PiniaPluginContext, Store } from 'pinia';
import { EppsContructor } from '../plugins/epps';
import { EppsConstructorProps } from '../plugins/eppsPlugin';
import { ExtendedStateOptions } from '../plugins/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, EppsStore as EppsStoreInterface, ExtendedState } from './store';
import { ErrorsState, ErrorsStore } from '../stores/errors'
import { Item } from '../models/item';
import type { ParentStore as ParentStoreType } from "../types/epps"
import { ResourceIdStore } from '../stores/resourceId'
import { WebUserState, WebUserStore } from '../stores/webuser'


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