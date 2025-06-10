import { defineStore, DefineStoreOptions, StateTree, StoreDefinition, StoreGetters } from "pinia"
import type { Item } from "../models/item"
import type { AnyObject } from "../types"
import type { DefineEppsStore, DefineEppsStoreOptionApi, PersistedState } from "../types/store"


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


export function defineEppsStore<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Sto>, 'id'> | (() => AnyObject)
): DefineEppsStore<Sto, Sta> {
    return typeof storeDefinition === 'function'
        ? defineEppsStoreSetup(id, storeDefinition)
        : defineEppsStoreOptionApi(id, storeDefinition)
}

export function defineEppsStoreSetup<Sto, Sta>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<Sto, Sta> {
    return defineStore(id, storeDefinition)
}

export function defineEppsStoreOptionApi<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'>
): StoreDefinition<string, Partial<Sta>, AnyObject, Partial<Sto>> {
    return defineStore(id, storeDefinition)
}