import { PiniaPluginContext, Store } from 'pinia';
import { EppsConstructorProps } from '../plugins/epps';
import { ExtendedStateOptions } from './plugins/pinia/extendsStore/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, ExtendedState } from './types/store';

export type {
    AnyObject,
    SearchCollectionCriteria
} from './index';

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

export { createPlugin, Epps } from "../plugins/epps";
export { extendedState } from "../plugins/pinia/extendsStore/extendedState";
export { getParentStorePropertyValue } from "../plugins/pinia/extendsStore/parentStore";
export { useCollectionStore } from '../stores/collection';


declare module 'epps' {
    export function createPlugin(dbName: string, cryptIv?: string, cryptKey?: string): CallableFunction;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export class Epps {
        constructor({ dbName, dbKeyPath, cryptIv, cryptKey }: EppsConstructorProps)

        plugin(context: PiniaPluginContext): void
    }

    export function extendedState(
        parentsStores: Store[],
        options?: ExtendedStateOptions
    ): ExtendedState;

    export function getParentStorePropertyValue(
        propertyName: string,
        parentStore: AnyObject | string | number | undefined,
        parentsStores?: Store[]
    ): any;

    export function useCollectionStore(id: string): Store & CollectionState & CollectionStoreMethods;
}

/**
 import { PiniaPlugin, PiniaPluginContext, Store } from 'pinia';
import { EppsConstructorProps } from '../plugins/epps';
import { ExtendedStateOptions } from '../plugins/pinia/extendsStore/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, ExtendedState } from './store';


export interface AnyObject {
    [key: number | string | symbol]: any;
}
export interface SearchCollectionCriteria {
    [key: number | string | symbol]: boolean | number | string;
}

export type {
    AugmentOptionApiStore,
    AugmentStore,
    CollectionState,
    CollectionStoreMethods,
    DefineExtendedStore,
    DefineExtendedStoreOptionApi,
    EppsStore,
    ExtendState,
    ExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";


declare module 'epps' {
    export function createPlugin(dbName: string, cryptIv?: string, cryptKey?: string): PiniaPlugin;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export class Epps {
        constructor({ dbName, dbKeyPath, cryptIv, cryptKey }: EppsConstructorProps)

        plugin(context: PiniaPluginContext): void
    }

    export function extendedState(
        parentsStores: Store[],
        options?: ExtendedStateOptions
    ): ExtendedState;

    export function getParentStorePropertyValue(
        propertyName: string,
        parentStore: AnyObject | string | number | undefined,
        parentsStores?: Store[]
    ): any;

    export function useCollectionStore<T>(id: string): Store & CollectionState<T> & CollectionStoreMethods;
}
 */
