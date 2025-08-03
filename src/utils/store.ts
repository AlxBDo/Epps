import { DefineSetupStoreOptions, defineStore, DefineStoreOptions, StateTree, Store, StoreDefinition, StoreGetters } from "pinia"
import type { Item } from "../models/item"
import type { AnyObject, EppsStore } from "../types"
import type { DefineEppsStore, EppsStoreOptions, PersistedState } from "../types/store"
import { PersistOptions } from "../plugins/extendedState"
import { Epps } from "../plugins/epps"


export const itemState: Item = {
    '@id': undefined,
    id: undefined
}

export const persistedState = (
    persist: boolean = true,
    persistedPropertiesToEncrypt?: string[],
    excludedKeys?: string[],
    isEncrypted = false

): PersistedState => ({
    excludedKeys,
    isEncrypted,
    persist,
    persistedPropertiesToEncrypt
})

export interface DefineEppsStoreOtions extends EppsStoreOptions {
    eppsOptions?: Epps
}

export function defineEppsStore<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'> | (() => AnyObject),
    options?: DefineEppsStoreOtions | Epps
): DefineEppsStore<Sto, Sta> {
    if (options instanceof Epps) {
        options = { eppsOptions: options }
    }

    return typeof storeDefinition === 'function'
        ? defineEppsStoreSetup(
            id,
            storeDefinition,
            options
        )
        : defineEppsStoreOptionApi(
            id,
            storeDefinition,
            options
        )
}

export function defineEppsStoreSetup<Sto, Sta>(
    id: string,
    storeDefinition: () => AnyObject,
    options?: EppsStoreOptions
): DefineEppsStore<Sto, Sta> {
    return defineStore(id, storeDefinition, options)
}

export function defineEppsStoreOptionApi<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'>,
    options?: EppsStoreOptions
): DefineEppsStore<Sto, Sta> {
    if (options) {
        storeDefinition = { ...storeDefinition, ...(options ?? {}) } as Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'>
    }

    return defineStore(id, storeDefinition)
}