<script setup lang="ts">
import { eppsLog } from '../../../utils/log';
import { useConnectedUserStore } from '../../../stores/experiments/connectedUser'
import { useOptionApiStore, type OptionApiStore, type OptionApiState } from '../../../stores/experiments/optionApi'

import type { UserStore, UserState } from '../../../stores/experiments/user'
import type { EppsStore } from '../../../types/store';
import { useWebUserStore, WebUserState, WebUserStore } from '../../../stores/webuser';

const connectedUser = useConnectedUserStore() as EppsStore<UserStore, UserState>

connectedUser.remember().then(() => {
    eppsLog('connectedUser', connectedUser.user)

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

setTimeout(async () => {
    optionApiStore.test = 'An another test string'
}, 3000)

const webUserStore = useWebUserStore() as EppsStore<WebUserStore, WebUserState>
webUserStore.setData({ '@id': '/webuser/1', username: 'webusername', password: 'W€BuS2RpWd' })
webUserStore.id = 1
console.log('webuser', webUserStore, webUserStore.id)


setTimeout(async () => {
    connectedUser.setData({ email: '' })
    console.log('connectedUser errors', connectedUser.errors)
}, 6000)
setTimeout(async () => {
    connectedUser.clearErrors()
    console.log('connectedUser errors after clear', connectedUser.errors)
}, 12000)
</script>

<template>
    <p v-if="connectedUser.firstname">Hello {{ connectedUser.firstname }}</p>
    <p v-if="webUserStore.username">Hello {{ webUserStore.id }}</p>
    <div v-if="connectedUser.hasError()">
        <p>🚧 ERROR</p>
        <p v-for="error of connectedUser?.errors">{{ error.message }}</p>
    </div>
    <p>optionApiStore test: {{ optionApiStore.test }}</p>
</template>