import { describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin } from './utils/beforeEach'
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

    beforeEachPiniaPlugin()

    let connectedUserStore: EppsStore<UserStore, UserState> | undefined

    it('Has setData method and methods defined in actionsToExtends are extends', async () => {
        connectedUserStore = useConnectedUserStore() as EppsStore<UserStore, UserState>
        connectedUserStore.setData(user)

        expect(connectedUserStore.user).toStrictEqual(user)

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
        if (connectedUserStore) {
            connectedUserStore.lastname = newLastname
            await new Promise(resolve => setTimeout(resolve, 500)) // wait for state mutation
            expect(connectedUserStore.lastname).toStrictEqual(newLastname)
        }
    })

    it('Watch and persist state mutation', async () => {
        if (connectedUserStore) {
            const persistedContact = await persister.getItem('connectedUser') as User
            expect(persistedContact?.lastname).toStrictEqual(newLastname)
        }
    })

    it('ExcludedKeys are not persist', async () => {
        if (connectedUserStore) {
            const persistedContactItem = await persister.getItem('connectedUser') as User
            expect(persistedContactItem['@id']).toBeUndefined()
        }
    })

    it('Stop watch and persist state mutation', async () => {
        if (connectedUserStore) {
            connectedUserStore.stopWatch()

            connectedUserStore.lastname = undefined
            expect(connectedUserStore.lastname).toBeUndefined()

            const persistedContact = await persister.getItem('connectedUser') as User

            expect(persistedContact.lastname).toStrictEqual(newLastname)
        }
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
        if (connectedUserStore) {
            connectedUserStore.$reset()
            const persistedConnectedUser = await persister.getItem('connectedUser') as User

            expect(persistedConnectedUser).not.toBeDefined()

            expect(connectedUserStore.user).not.toStrictEqual(user)
            expect(connectedUserStore.firstname).not.toBeDefined()
        }
    })
})