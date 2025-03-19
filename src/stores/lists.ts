import { ref } from "vue"
import { defineEppsStore } from "../utils/store"
import { extendedState } from "../plugins/pinia/extendsStore/extendedState"
import { useCollectionStore } from "./collection"

import type { CollectionState, CollectionStoreMethods } from "../types/store"
import type { List } from "../models/liste"


const defaultStoreId: string = 'lists'

export const useListsStore = (id?: string) => defineEppsStore<CollectionStoreMethods, CollectionState<List>>(
    id ?? defaultStoreId,
    () => ({
        ...extendedState(
            [useCollectionStore('listsCollection')],
            { isOptionApi: false, persist: { persist: ref(true) } }
        )
    })
)()