import { extendedState } from "../plugins/extendedState";
import { IItemStore, useItemStore, type IItemStoreState } from "./item";
import type { CollectionState, CollectionStoreMethods, ExtendedState } from "../types/store";
import type { List } from "../models/liste";
import { useCollectionStore } from "./collection";
import { defineEppsStore } from "../utils/store";
import { Ref, ref } from "vue";
import { User } from "../models/user";
import { getParentStoreMethod } from "../plugins/parentStore";
import { ListTypes } from "../types/list";
import { Item } from "../models/item";


export interface ListStoreState extends IItemStoreState, ExtendedState, CollectionState<Item>, Omit<List, 'items'> {
    guest?: Ref<User[]> | User[]
    owner?: Ref<User> | User
}
export type ListStoreMethods = CollectionStoreMethods & IItemStore & { setData: (data: ListStoreState) => void }


export const useListStore = (id: string | number) => defineEppsStore<CollectionStoreMethods, ListStoreState>(
    `list-${id}`,
    () => {
        const extendedStates = extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)],
            { actionsToExtends: ['setData'] }
        )
        const guest = ref<User[]>([])
        const owner = ref<User>()
        const type = ref<ListTypes>()

        function setData(data: ListStoreState) {
            if (data.guest) { guest.value = Array.isArray(data.guest) ? data.guest : data.guest?.value; }

            if (data.items) {
                const setItems = extendedStates.parentsStores && getParentStoreMethod(
                    'setItems',
                    `list-${id}-items`,
                    extendedStates.parentsStores()
                )

                setItems && setItems(data.items)
            }

            if (data.owner) { owner.value = (data.owner as Ref)?.value ?? data.owner; }

            if (data.type) { type.value = data.type }
        }

        return {
            ...extendedStates,
            guest,
            owner,
            type,
            setData
        }
    }
)()
