import { Store } from "pinia"
import { EppsStore } from "../types"

const eppsStores: Map<string, Store> = new Map<string, Store>()

export function addEppsStore(store: Store) {
    eppsStores.set(store.$id, store)
}

export function getEppsStore<TStore, TState>(storeId: string): EppsStore<TStore, TState> {
    return eppsStores.get(storeId) as EppsStore<TStore, TState>
}