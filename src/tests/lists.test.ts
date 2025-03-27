import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPluginMock } from './mocks/epps'
import { ListStoreState, useListStore } from '../stores/list'
import { CollectionStoreMethods, EppsStore } from '../types'


const lists = [
    { id: 1, name: 'list1', type: '0' },
    { id: 2, name: 'list2', type: '1' },
    { id: 3, name: 'list3', type: '2' },
    { id: 4, name: 'list4', type: '0' },
]

describe('ListsStore extends collectionStore', () => {
    const app = createApp({})

    beforeEach(() => {
        const pinia = createPinia().use(
            createPluginMock('localStorage', 'CryptK€Y-EPpS_t35t!n9&%?qa31z', 'Cryptk€Y-EPpS_t35t!n9')
        )
        app.use(pinia)
        setActivePinia(pinia)
    })

    let listsStore: EppsStore<CollectionStoreMethods, ListStoreState> | undefined

    it('Has addItem method', () => {
        listsStore = useListStore('lists-testing') as EppsStore<CollectionStoreMethods, ListStoreState>
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

    it('Has updateItem method', () => {
        if (listsStore) {
            const updatedItem = { ...lists[0], name: 'updatedList1' }
            listsStore.updateItem(updatedItem, lists[0])

            expect(listsStore.getItems({ id: 1 })).toStrictEqual([updatedItem])
        }
    })

    it('Has removeItem method', () => {
        if (listsStore) {
            listsStore.removeItem({ id: 1 })

            expect(listsStore.items).toHaveLength(3)
        }
    })
})