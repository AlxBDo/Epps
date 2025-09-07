import { beforeEach, describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin, createAppAndPinia } from './utils/beforeEach'
import PersisterMock from '../testing/mocks/persister'
import { useConnectedUserStore } from '../stores/experiments/connectedUser'

import type { EppsStore } from '../types'
import type { User } from '../models/user'
import type { UserState, UserStore } from '../stores/experiments/user'


const user = {
    '@id': 'user/1',
    id: 1,
    firstname: 'Ernest',
    email: 'ernesttest@mail.fr',
    lastname: 'Test',
    password: 'my-p@ssw0rd_72941'
}

const newLastname = 'Testte'

describe('connectedUserStore extends userStore, contactStore and itemStore', () => {
    const persister = new PersisterMock({ name: 'localStorage' })

    let connectedUserStore: EppsStore<UserStore, UserState>

    beforeEach(() => {
        createAppAndPinia()

        if (!connectedUserStore) {
            connectedUserStore = useConnectedUserStore() as EppsStore<UserStore, UserState>
        }
    })

    it('Has setData method and methods defined in actionsToExtends are extends', async () => {
        connectedUserStore.setData(user)

        expect({ ...connectedUserStore.user, id: connectedUserStore.id, '@id': connectedUserStore['@id'] }).toStrictEqual(user)

        await connectedUserStore.persistState()
    })

    it('Is persisted', async () => {
        const persistedContact = await persister.getItem('connectedUser') as User

        expect(persistedContact.firstname).toStrictEqual(user.firstname)
        expect(persistedContact.email).toBeDefined()
        expect(persistedContact.email?.length).toBeGreaterThan(user.email.length)
        expect(persistedContact.email).not.toBe(user.email)
        expect(persistedContact.lastname).toStrictEqual(user.lastname)
    })

    it('Property define in persistedPropertiesToEncrypt is persisted encrypted', async () => {
        const persistedConnectedUser = await persister.getItem('connectedUser') as User

        expect(persistedConnectedUser.password).toBeDefined()
        expect(persistedConnectedUser.password?.length).toBeGreaterThan(user.password.length)
        expect(persistedConnectedUser.password).not.toBe(user.password)
    })

    it('Has access to parent state property and modify it', async () => {
        connectedUserStore.lastname = newLastname
        expect(connectedUserStore.lastname).toStrictEqual(newLastname)
    })

    it('Watch and persist state mutation', async () => {
        await new Promise(resolve => setTimeout(resolve, 500)) // wait for state mutation
        const persistedContact = await persister.getItem('connectedUser') as User
        expect(persistedContact?.lastname).toStrictEqual(newLastname)
    })

    it('ExcludedKeys are not persist', async () => {
        const persistedContactItem = await persister.getItem('connectedUser') as User
        expect(persistedContactItem['@id']).toBeUndefined()
    })

    it('Stop watch and persist state mutation', async () => {
        connectedUserStore.stopWatch()
        connectedUserStore.lastname = undefined

        expect(connectedUserStore.lastname).toBeUndefined()

        const persistedContact = await persister.getItem('connectedUser') as User

        expect(persistedContact.lastname).toStrictEqual(newLastname)
    })

    it('Remember state with decrypted properties', async () => {
        const otherUserStore = useConnectedUserStore() as EppsStore<UserStore, UserState>

        expect(otherUserStore.firstname).not.toBeDefined()
        expect(otherUserStore.id).not.toBeDefined()
        expect(otherUserStore.lastname).not.toBeDefined()

        await otherUserStore.remember()

        expect(otherUserStore.user).toStrictEqual({ ...user, lastname: newLastname, '@id': undefined })
    })

    it('$reset method clear all states (child and parents) and persisted data', async () => {
        connectedUserStore.$reset()
        const persistedConnectedUser = await persister.getItem('connectedUser') as User

        expect(connectedUserStore.user).not.toStrictEqual(user)
        expect(connectedUserStore.firstname).not.toBeDefined()

        expect(persistedConnectedUser).not.toBeDefined()
    })
})