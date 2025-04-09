import { extendedState } from "../plugins/extendedState";
import { useItemStore, type IItemStoreState } from "./item";
import type { CollectionState, CollectionStoreMethods, ExtendedState } from "../types/store";
import type { List } from "../models/liste";
import { useCollectionStore } from "./collection";
import { defineStore } from "pinia";
import { defineEppsStore } from "../utils/store";
import { ref } from "vue";
import { User } from "../models/user";
import { SearchCollectionCriteria } from "../types";
import { getParentStoreMethod } from "../plugins/parentStore";


export type ListStoreState = IItemStoreState & ExtendedState & CollectionState<List>

/**
export const useListStore = (id: string | number) => defineStore(`list-${id}`, {
    state: (): ListStoreState => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)]
        ),
        guest: [],
        owner: undefined,
        type: undefined
    }),
})
 */

export const useListStore = (id: string | number) => defineEppsStore<CollectionStoreMethods, ListStoreState>(
    `list-${id}`,
    () => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)],
            {
                isOptionApi: false,
                persist: { persist: ref(true), watchMutation: ref(true) }
            }
        ),
        guest: ref<User[]>([]),
        owner: ref<User>()
    })
)()
