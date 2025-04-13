<script setup lang="ts">
import type { User } from '../../../models/user';
import { useListStore, type ListStoreState, type ListStoreMethods } from '../../../stores/list';
import type { EppsStore } from '../../../types';
import { log } from '../../../utils/log';

const owner: User = { id: 1, firstname: 'Omar', lastname: 'Teen', email: 'omarteen@mail.com' }
const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }, { id: 3, name: 'Item 3' }]
const listStore = useListStore('test') as EppsStore<ListStoreMethods, ListStoreState>

listStore.setData({ id: 1, name: 'My List', owner, items, type: '0' } as ListStoreState)

listStore.addItem({ id: 4, name: 'Item 4' })

const listOwner = listStore.owner

log('ListStore', [listStore.items, listStore.$state])
</script>

<template>
    <h2>List {{ listStore?.name }}</h2>
    <p>Type: {{ listStore.type }}</p>
    <p>Owner: {{ listOwner?.firstname }} {{ listOwner?.lastname }}</p>
    <div>
        Items :
        <ul>
            <li v-for="item in listStore.items" :key="item.id">
                {{ item }}
            </li>
        </ul>
    </div>
</template>