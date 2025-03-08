import type { Item } from "../models/item"
import type { AnyObject } from "../types"
import type { PersistedState } from "../types/store"


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


export function getStoreName(store: AnyObject): string {
    return store.hasOwnProperty('getStoreName') ? store.getStoreName() : store.$id
}