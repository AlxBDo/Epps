import { Store } from "pinia"
import { EppsStore } from "../types"

const eppsStores: Record<string, Store> = {}

export function addEppsStore(store: Store) {
    eppsStores[store.$id] = store
}

export function getEppsStore<TStore, TState>(storeId: string): EppsStore<TStore, TState> {
    return eppsStores[storeId] as EppsStore<TStore, TState>
}