import { beforeEach, describe, expect, it } from 'vitest'

import { createAppAndPinia } from './utils/beforeEach'
import { useListsStore, type ListsState, type ListsStoreMethods } from '../stores/experiments/lists'

import type { EppsStore } from '../types'


const lists = [
    { id: 1, name: 'list1', type: '0' },
    { id: 2, name: 'list2', type: '1' },
    { id: 3, name: 'list3', type: '2' },
    { id: 4, name: 'list4', type: '0' },
]

describe('ListsStore extends collectionStore', () => {
    let listsStore: EppsStore<ListsStoreMethods, ListsState>

    beforeEach(() => {
        createAppAndPinia()

        if (!listsStore) {
            listsStore = useListsStore('lists-testing') as EppsStore<ListsStoreMethods, ListsState>
        }
    })

    it('Has addItem method', () => {
        listsStore.addItem(lists[0])

        expect(listsStore.getLists()).toHaveLength(1)
    })

    it('Has access to collectionStore state', () => {
        expect(listsStore.lists[0].name).toBe(lists[0].name)
        expect(listsStore.lists[0].type).toBe(lists[0].type)
        expect(listsStore.lists[0].id).toBe(lists[0].id)
    })

    it('Has setItem method', () => {
        listsStore.setItems(lists)

        expect(listsStore.lists).toHaveLength(lists.length)
        expect(listsStore.lists[2]).toStrictEqual(lists[2])
    })

    it('Has getItem method and get a list by criteria', () => {
        expect(listsStore.getItem({ id: 2 })).toStrictEqual(lists[1])
        expect(listsStore.getItem({ name: 'list1' })).toStrictEqual(lists[0])
    })

    it('Has getLists method and get all or search specifics lists', () => {
        expect(listsStore.getLists()).toHaveLength(lists.length)
        expect(listsStore.getLists({ id: 2 })).toStrictEqual([lists[1]])
        expect(listsStore.getLists({ type: '0' })).toStrictEqual([lists[0], lists[3]])
    })

    it('Can use parent store method in child store method', () => {
        expect(listsStore.getLists()).toHaveLength(lists.length)
        expect(listsStore.getLists({ id: 2 })).toStrictEqual([lists[1]])
        expect(listsStore.getLists({ type: '0' })).toStrictEqual([lists[0], lists[3]])
    })

    it('Has updateItem method', () => {
        const updatedItem = { ...lists[0], name: 'updatedList1' }
        listsStore.updateItem(updatedItem)

        expect(listsStore.getLists({ id: 1 })).toStrictEqual([updatedItem])
    })


    it('Add existing item update it', () => {
        const newItem = { ...lists[1], name: 'updatedList2' }
        listsStore.addItem(newItem)

        expect(listsStore.getItem({ id: 2 })).toStrictEqual(newItem)
    })

    it('Has removeItem method', () => {
        listsStore.removeItem({ id: 1 })

        expect(listsStore.lists).toHaveLength(3)
        expect(listsStore.getItem({ id: 1 })).toBeUndefined()
    })
})