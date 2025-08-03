import { PiniaPlugin, PiniaPluginContext, Store } from 'pinia';
import { Epps, EppsContructor } from '../plugins/epps';
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


declare module 'epps' {
    export function createPlugin(dbName: string, cryptKey?: string, debug?: boolean): PiniaPlugin;

    export function createPluginMock(dbName: string, cryptKey?: string): PiniaPlugin;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject, eppsOptions: Epps): DefineEppsStore<TStore, TState>

    export function defineStoreId(prefix: string, id: string): string

    export class EppsPlugin {
        constructor({ dbName, dbKeyPath, cryptKey }: EppsConstructorProps)

        plugin(context: PiniaPluginContext): void
    }

    export class Epps {
        constructor(options: EppsContructor)

        getStore<TStore, TState>(idOrIndex: number | string, childId?: string): EppsStoreInterface<TStore, TState> | undefined

        parentsStores(childId?: string): EppsStoreInterface<AnyObject, AnyObject>[]
    }

    export function extendedState(
        parentsStores: Store[],
        options?: ExtendedStateOptions
    ): ExtendedState;

    export function getParentStore<TStore = AnyObject, TState = AnyObject>(
        parentStoreIdOrIndex: string | number,
        parentsStores?: Array<Store | EppsStoreInterface<TStore, TState>>
            | (() => Array<Store | EppsStoreInterface<TStore, TState>>)
            | undefined
    ): EppsStoreInterface<TStore, TState> | undefined

    export function getParentStoreMethod(
        methodName: string,
        parentStore: AnyObject | string | number | undefined,
        parentsStores?: Store[] | EppsStoreInterface<AnyObject, AnyObject>[]
    ): Function

    export function getParentStorePropertyValue(
        propertyName: string,
        parentStore: AnyObject | string | number | undefined,
        parentsStores?: Store[]
    ): any;

    class ParentStore<TStore = AnyObject, TState = AnyObject> {
        _id: string
        _constructor: ParentStoreType
        id: string

        constructor(id: string, store: ParentStoreType)

        build(childId: string): EppsStoreInterface<TStore, TState>
    }

    export function useCollectionStore<T>(id: string): Store & CollectionState<T> & CollectionStoreMethods;

    export function useErrorsStore<T>(id: string): Store & ErrorsState & ErrorsStore;

    export function useResourceIdStore<T>(id: string): Store & ResourceIdStore & Item;

    export function useWebUserStore<T>(id: string): Store & WebUserState & WebUserStore;
}