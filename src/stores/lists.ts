import { defineStore } from "pinia"
import { extendedState } from "../plugins/pinia/extendsStore/extendedState"
import { useCollectionStore } from "./collection"

import type { List } from "../models/liste"
import type { CollectionState, CollectionStoreMethods, ExtendedState, DefineExtendedStore } from "../types/store"

const defaultStoreId: string = 'lists'

export const useListsStore: DefineExtendedStore<Partial<CollectionStoreMethods>, Partial<CollectionState<List>>> = (
    id?: string
) => defineStore(id ?? defaultStoreId, {
    state: (): ExtendedState => ({
        ...extendedState(
            [useCollectionStore('listsCollection')],
            { persist: { persist: true } }
        )
    })
})()