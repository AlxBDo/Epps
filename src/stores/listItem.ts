import { extendedState } from "../plugins/pinia/extendsStore/extendedState";
import { useItemStore, type IItemStoreState } from "./item";
import type { ExtendedState } from "../types/store";
import type { List } from "../models/liste";
import type { ListItem } from "../models/listitem";
import { defineStore } from "pinia";


interface IListStoreState extends IItemStoreState, ExtendedState, List {

}

type PartialListItemStoreState = IItemStoreState & ExtendedState & ListItem

export const useListItemStore = (id: string | number) => defineStore(`listItem-${id}`, {
    state: (): PartialListItemStoreState => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`)]
        ),
        category: undefined,
        description: undefined,
        list: undefined,
        name: undefined,
        status: undefined,
        url: undefined
    }),

    actions: {
        setData(data: ListItem) {
            if (data.category) {
                // TODO: créer category store
                this.category = data.category
            }

            if (data.description) { this.description = data.description }

            if (data.list) { this.list = data.list }

            if (data.status) { this.status = data.status }

            if (data.url) { this.url = data.url }
        }
    }
})