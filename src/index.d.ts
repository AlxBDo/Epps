import { PiniaPlugin, PiniaPluginContext, Store } from 'pinia';
import { EppsConstructorProps } from '../plugins/epps';
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
export { EppsPlugin } from "./plugins/eppsPlugin";
export { useCollectionStore } from './stores/collection';


declare module 'epps' {
    export function createPlugin(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;

    export function createPluginMock(dbName: string, cryptKey?: string, cryptKey?: string): PiniaPlugin;

    export function defineEppsStore<TStore, TState>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<TStore, TState>

    export class EppsPlugin {
        constructor({ dbName, dbKeyPath, cryptKey, cryptKey }: EppsConstructorProps)

        plugin(context: PiniaPluginContext): void
    }

    export function useCollectionStore(id: string): Store & CollectionState & CollectionStoreMethods;
}