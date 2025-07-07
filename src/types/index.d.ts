import { PiniaPluginContext, Store } from 'pinia';
import { EppsConstructorProps } from '../plugins/epps';
import { ExtendedStateOptions } from '../plugins/extendedState';
import { CollectionState, CollectionStoreMethods, DefineEppsStore, ExtendedState } from '../types/store';
import { AnyObject } from './index';

export type {
    AnyObject,
    SearchCollectionCriteria
} from './index';

export type {
    AugmentOptionApiStore,
    CollectionState,
    CollectionStoreMethods,
    ExtendedStore,
    PersistedState,
    PersistedStore
} from "./store";

export { createPlugin, Epps } from "../plugins/epps";
export { extendedState } from "../plugins/extendedState";
export { getParentStorePropertyValue } from "../plugins/parentStore";
export { useCollectionStore } from '../stores/collection';


declare module 'epps' {
    export function createPlugin(dbName: string, cryptKey?: string): CallableFunction;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export class Epps {
        constructor({ dbName, dbKeyPath, cryptKey }: EppsConstructorProps)

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

    export function useCollectionStore<T>(): Store & CollectionState<T> & CollectionStoreMethods;
}
