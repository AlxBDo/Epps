<script setup lang="ts">
import { useConnectedUserStore } from '../../../stores/connectedUser'
import { useListStore, type ListStoreState } from '../../../stores/list';

import type { UserStore, UserState } from '../../../stores/user'
import type { CollectionStoreMethods, EppsStore, ExtendedStore } from '../../../types/store';
import { log } from '../../../utils/log';

const connectedUser = useConnectedUserStore() as ExtendedStore<UserStore, UserState>

connectedUser.setData({
    email: 'mitchwee@mail.com',
    firstname: 'Mitch',
    id: 1,
    lastname: 'Wee',
    password: 'C4Nn€cT2D@!12'
})

log('connectedUser', connectedUser.user)

setTimeout(async () => {
    //const anotherUser = useConnectedUserStore() as ExtendedStore<UserStore, UserState>
    //await anotherUser.remember()
    //log('anotherUser', anotherUser.user)
    connectedUser.$reset()
    log('$reset user', connectedUser.user)
}, 3000)
</script>

<template>
    <p v-if="connectedUser.firstname">Hello {{ connectedUser.firstname }}</p>
</template>