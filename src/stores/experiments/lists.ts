import { ref } from "vue"
import { defineEppsStore } from "../../utils/store"
import { extendedState } from "../../plugins/extendedState"
import { getParentStoreMethod } from "../../plugins/parentStore"
import { useCollectionStore } from "../collection"

import type { CollectionState, CollectionStoreMethods } from "../../types/store"
import type { List } from "../../models/liste"
import type { SearchCollectionCriteria } from "../../types"


export type ListsStoreMethods = CollectionStoreMethods & { getLists: (criteria?: SearchCollectionCriteria) => List[] }

const defaultStoreId: string = 'lists'

export const useListsStore = (id?: string) => defineEppsStore<ListsStoreMethods, CollectionState<List>>(
    id ?? defaultStoreId,
    () => {
        const {
            excludedKeys,
            actionsToExtends,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt,
            watchMutation
        } = extendedState(
            [useCollectionStore('listsCollection')],
            { persist: { watchMutation: ref(true) } }
        )


        function getLists(criteria?: SearchCollectionCriteria) {
            return parentsStores && getParentStoreMethod('getItems', 0, parentsStores())(criteria)
        }

        return {
            actionsToExtends,
            getLists,
            excludedKeys,
            parentsStores,
            persist,
            persistedPropertiesToEncrypt,
            watchMutation
        }
    }
)()