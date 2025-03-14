import { defineStore } from "pinia"
import type { Item } from "../models/item"
import type { AnyObject } from "../types"
import type { DefineEppsStore, PersistedState } from "../types/store"


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


export function defineEppsStore<Sto, Sta>(id: string, storeDefinition: () => AnyObject): DefineEppsStore<Sto, Sta> {
    return defineStore(id, storeDefinition)
}

export function getStoreName(store: AnyObject): string {
    return store.hasOwnProperty('getStoreName') ? store.getStoreName() : store.$id
}