<script setup lang="ts">
import { useConnectedUserStore } from '../../../stores/connectedUser'
import { useListStore, type ListStoreState } from '../../../stores/list';

import type { IUserStore, TUserState } from '../../../stores/user'
import type { CollectionStoreMethods, EppsStore, ExtendedStore } from '../../../types/store';
import { log } from '../../../utils/log';

const connectedUser = useConnectedUserStore() as ExtendedStore<IUserStore, TUserState>

const testEpps = useListStore('test2list') as EppsStore<CollectionStoreMethods, ListStoreState>

testEpps.setItems(['un truc'])

log('testEpps', testEpps.items)

connectedUser.setData({
    email: 'connecteduser@mail.com',
    firstname: 'Connecteduser',
    password: 'C4Nn€cT2D@!12'
})

log('connectedUser', connectedUser.user)

setTimeout(() => {
    connectedUser.$reset()
    log('reset user', connectedUser.user)
}, 3000)
</script>

<template>
    <p v-if="connectedUser.firstname">Hello {{ connectedUser.firstname }}</p>
</template>