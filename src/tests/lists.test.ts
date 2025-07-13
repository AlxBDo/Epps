import { describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin } from './utils/beforeEach'
import { useListsStore, type ListsStoreMethods } from '../stores/experiments/lists'

import type { CollectionState, EppsStore } from '../types'
import { List } from '../models/liste'


const lists = [
    { id: 1, name: 'list1', type: '0' },
    { id: 2, name: 'list2', type: '1' },
    { id: 3, name: 'list3', type: '2' },
    { id: 4, name: 'list4', type: '0' },
]

describe('ListsStore extends collectionStore', () => {
    beforeEachPiniaPlugin()

    let listsStore: EppsStore<ListsStoreMethods, CollectionState<List>> | undefined

    it('Has addItem method', () => {
        listsStore = useListsStore('lists-testing') as EppsStore<ListsStoreMethods, CollectionState<List>>
        listsStore.addItem(lists[0])

        expect(listsStore.getItems()).toHaveLength(1)
    })

    it('Has access to collectionStore state', () => {
        if (listsStore) {
            expect(listsStore.items[0].name).toBe(lists[0].name)
            expect(listsStore.items[0].type).toBe(lists[0].type)
            expect(listsStore.items[0].id).toBe(lists[0].id)
        }
    })

    it('Has setItem method', () => {
        if (listsStore) {
            listsStore.setItems(lists)

            expect(listsStore.items).toHaveLength(lists.length)
            expect(listsStore.items[2]).toStrictEqual(lists[2])
        }
    })

    it('Has getItem method and get a list by criteria', () => {
        if (listsStore) {
            expect(listsStore.getItem({ id: 2 })).toStrictEqual(lists[1])
            expect(listsStore.getItem({ name: 'list1' })).toStrictEqual(lists[0])
        }
    })

    it('Has getItems method and get all or search specifics items', () => {
        if (listsStore) {
            expect(listsStore.getItems()).toHaveLength(lists.length)
            expect(listsStore.getItems({ id: 2 })).toStrictEqual([lists[1]])
            expect(listsStore.getItems({ type: '0' })).toStrictEqual([lists[0], lists[3]])
        }
    })

    it('Can use parent store method in child store method', () => {
        if (listsStore) {
            expect(listsStore.getLists()).toHaveLength(lists.length)
            expect(listsStore.getLists({ id: 2 })).toStrictEqual([lists[1]])
            expect(listsStore.getLists({ type: '0' })).toStrictEqual([lists[0], lists[3]])
        }
    })

    it('Has updateItem method', () => {
        if (listsStore) {
            const updatedItem = { ...lists[0], name: 'updatedList1' }
            listsStore.updateItem(updatedItem)

            expect(listsStore.getItems({ id: 1 })).toStrictEqual([updatedItem])
        }
    })


    it('Add existing item update it', () => {
        if (listsStore) {
            const newItem = { ...lists[1], name: 'updatedList2' }
            listsStore.addItem(newItem)

            expect(listsStore.getItem({ id: 2 })).toStrictEqual(newItem)
        }
    })

    it('Has removeItem method', () => {
        if (listsStore) {
            listsStore.removeItem({ id: 1 })

            expect(listsStore.items).toHaveLength(3)
            expect(listsStore.getItem({ id: 1 })).toBeUndefined()
        }
    })
})