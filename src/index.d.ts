import { PiniaPlugin, PiniaPluginContext, Store } from 'pinia';
import { EppsConstructorProps } from '../plugins/epps';
import { ExtendedStateOptions } from './plugins/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, ExtendedState } from './types/store';

export type {
    AnyObject,
    SearchCollectionCriteria
} from './index';

export type {
    AugmentOptionApiStore,
    CollectionState,
    CollectionStoreMethods,
    DefineExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";

export { createPlugin } from './plugins/createPlugin'
export { Epps } from "./plugins/epps";
export { extendedState } from "./plugins/extendedState";
export { getParentStorePropertyValue } from "./plugins/parentStore";
export { useCollectionStore } from './stores/collection';


declare module 'epps' {
    export function createPlugin(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;

    export function createPluginMock(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export class Epps {
        constructor({ dbName, dbKeyPath, cryptKey, cryptKey }: EppsConstructorProps)

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
import { ExtendedStateOptions } from '../plugins/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, ExtendedState } from './store';


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
    DefineExtendedStore,
    EppsStore,
    PersistedState,
    PersistedStore
} from "./store";


declare module 'epps' {
    export function createPlugin(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;
    
    export function createPluginMock(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export function defineStoreId(prefix: string, id: string): string

    export class Epps {
        constructor({ dbName, dbKeyPath, cryptKey, cryptKey }: EppsConstructorProps)

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
