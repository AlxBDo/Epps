<script setup lang="ts">
import { useConnectedUserStore } from '../../../stores/connectedUser'
import { useOptionApiStore, type OptionApiStore, type OptionApiState } from '../../../stores/optionApi'

import type { UserStore, UserState } from '../../../stores/user'
import type { EppsStore } from '../../../types/store';
import { log } from '../../../utils/log';

const connectedUser = useConnectedUserStore() as EppsStore<UserStore, UserState>

connectedUser.remember().then(() => {
    log('connectedUser', connectedUser.user)

    if (!connectedUser.user.id) {
        connectedUser.setData({
            email: 'mitchwee@mail.com',
            firstname: 'Mitch',
            id: 1,
            lastname: 'Wee',
            password: 'C4Nn€cT2D@!12'
        })
    }
})


const optionApiStore = useOptionApiStore() as EppsStore<OptionApiStore, OptionApiState>
optionApiStore.setTest({ id: 1, test: 'my test string' })
optionApiStore.logTest()


setTimeout(async () => {
    optionApiStore.test = 'An another test string'
}, 3000)

setTimeout(async () => {
    connectedUser.setData({ email: '' })
}, 6000)

/**
 setTimeout(async () => {
    const anotherUser = useConnectedUserStore() as ExtendedStore<UserStore, UserState>
    await anotherUser.remember()
    log('anotherUser', anotherUser.user)
    //connectedUser.$reset()
    //log('$reset user', connectedUser.user)
}, 3000)
 */
</script>

<template>
    <p v-if="connectedUser.firstname">Hello {{ connectedUser.firstname }}</p>
    <div v-if="connectedUser.hasError()">
        <p>🚧 ERROR</p>
        <p v-for="error of connectedUser?.errors">{{ error.message }}</p>
    </div>
    <p>optionApiStore test: {{ optionApiStore.test }}</p>
</template>