import { extendedState } from "../plugins/pinia/extendsStore/extendedState";
import { useItemStore, type IItemStoreState } from "./item";
import type { ExtendedState } from "../types/store";
import type { List } from "../models/liste";
import { useCollectionStore } from "./collection";
import { defineStore } from "pinia";


export type PartialListStoreState = IItemStoreState & ExtendedState & List

export const useListStore = (id: string | number) => defineStore(`list-${id}`, {
    state: (): PartialListStoreState => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)]
        ),
        guest: [],
        owner: undefined,
        type: undefined
    }),
})