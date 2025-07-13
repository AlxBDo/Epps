import { defineStore } from "pinia";
import type { Item } from "../models/item";

export interface ResourceIdStore {
    setData: (data: Item) => void
}

export const useResourceIdStore = (id?: string) => defineStore(id ?? 'item', {
    state: (): Item => ({
        "@id": undefined,
        id: undefined
    }),

    actions: {
        setData(data: Partial<Item>) {
            if (data['@id']) { this['@id'] = data['@id'] }
            if (data.id) { this.id = data.id }
        }
    }
})()