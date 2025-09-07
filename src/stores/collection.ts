import { defineStore } from "pinia";
import type { AnyObject, SearchCollectionCriteria } from "../types";
import type { AugmentOptionApiStore, CollectionState, CollectionStoreMethods } from "../types/store";
import { arrayObjectFindAllBy, arrayObjectFindBy } from '../utils/object'
import { Comparison } from "../types/comparison";


type AugmentingStore = (id?: string) => AugmentOptionApiStore<CollectionStoreMethods, CollectionState<AnyObject>>

function getItemCriteria(item: AnyObject): SearchCollectionCriteria {
    return item.id ? { id: item.id } : { '@id': item['@id'] }
}


export const useCollectionStore: AugmentingStore = (id?: string) => defineStore(id ?? 'collectionStore', {
    state: (): CollectionState<AnyObject> => ({
        items: []
    }),

    actions: {
        addItem(item: AnyObject) {
            let foundedItem: AnyObject | undefined

            if (item.id || item['@id']) {
                foundedItem = this.getItem(
                    getItemCriteria(item)
                )

                if (foundedItem) {
                    this.updateItem(item, foundedItem)
                    return
                }
            }

            this.items.push(item)
        },

        clear() {
            this.items = []
        },

        getItem(criteria: Partial<AnyObject>): AnyObject | undefined {
            return arrayObjectFindBy<AnyObject>(
                this.items as AnyObject[],
                criteria as Partial<AnyObject> & SearchCollectionCriteria
            )
        },

        getItems(criteria?: Partial<AnyObject>, comparisonMode: Comparison = 'strict'): AnyObject[] {
            if (!criteria) {
                return this.items
            }

            return arrayObjectFindAllBy<AnyObject>(
                this.items as AnyObject[],
                criteria as Partial<AnyObject> & SearchCollectionCriteria,
                comparisonMode
            )
        },

        removeItem(item: AnyObject) {
            this.items = this.items.filter((i: AnyObject) => i.id !== item.id)
        },

        setItems<T>(items: T[]) {
            if (Array.isArray(items)) {
                this.items = items as AnyObject[]
            }
        },

        updateItem(updatedItem: AnyObject, oldItem?: AnyObject) {
            if (!oldItem) {
                oldItem = this.getItem(getItemCriteria(updatedItem))
            }

            if (oldItem) {
                Object.assign(oldItem, updatedItem)
            }
        }
    }
})()