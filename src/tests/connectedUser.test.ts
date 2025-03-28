import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin } from './utils/beforeEach'
import { useConnectedUserStore } from '../stores/connectedUser'
import { ListStoreState, useListStore } from '../stores/list'

import type { CollectionStoreMethods, EppsStore } from '../types'
import type { UserState, UserStore } from '../stores/user'
import { Contact } from '../models/contact'
import { localStorageMock } from '../testing/mocks/localStorage'
import PersisterMock from '../testing/mocks/persister'
import { User } from '../models/user'


const user = {
    '@id': 'user/1',
    id: 1,
    firstname: 'Ernest',
    email: 'ernesttest@mail.fr',
    lastname: 'Test',
    password: 'my-p@ssw0rd_72941'
}

describe('connectedUserStore extends userStore, contactStore and itemStore', () => {
    const persister = new PersisterMock({ name: 'localStorage' })

    beforeEachPiniaPlugin()

    let connectedUserStore: EppsStore<UserStore, UserState> | undefined

    it('Has setData method and methods defined in actionsToExtends are extends', () => {
        connectedUserStore = useConnectedUserStore() as EppsStore<UserStore, UserState>
        connectedUserStore.setData(user)

        expect(connectedUserStore.user).toStrictEqual(user)
    })

    it('Is persisted', async () => {
        const persistedContact = await persister.getItem('connected-user-contact') as Contact

        expect(persistedContact.firstname).toStrictEqual(user.firstname)
        expect(persistedContact.email).toBeDefined()
        expect(persistedContact.email?.length).toBeGreaterThan(user.email.length)
        expect(persistedContact.email).not.toBe(user.email)
        expect(persistedContact.lastname).toStrictEqual(user.lastname)
    })

    it('Property define in persistedPropertiesToEncrypt is persisted encrypted', async () => {
        const persistedConnectedUser = await persister.getItem('connected-user') as User

        expect(persistedConnectedUser.password).toBeDefined()
        expect(persistedConnectedUser.password?.length).toBeGreaterThan(user.password.length)
        expect(persistedConnectedUser.password).not.toBe(user.password)
    })

    it('Has access to parent state property and modify it', async () => {
        if (connectedUserStore) {
            const password = 'my_n€w-p@ssw0rd947'
            connectedUserStore.password = password
            expect(connectedUserStore.password).toStrictEqual(password)
        }
    })

    it('$reset method clear all states (child and parents) and persisted data', async () => {
        if (connectedUserStore) {
            connectedUserStore.$reset()
            const persistedConnectedUser = await persister.getItem('connected-user') as User
            const persistedContact = await persister.getItem('connected-user-contact') as Contact

            expect(persistedConnectedUser).not.toBeDefined()
            expect(persistedContact).not.toBeDefined()

            expect(connectedUserStore.user).not.toStrictEqual(user)
            expect(connectedUserStore.firstname).not.toBeDefined()
        }
    })
})