import { describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin } from './utils/beforeEach'
import PersisterMock from '../testing/mocks/persister'

describe('Persister : persist all types of data', () => {
    const persister = new PersisterMock({ name: 'localStorage' })

    it('Persist string', async () => {
        const item = 'My string test'
        persister.setItem('string-test', item)

        const persistedStr = await persister.getItem('string-test')

        expect(persistedStr).toStrictEqual(item)
    })

    it('Remove string persisted', async () => {
        persister.removeItem('string-test')

        const persistedStr = await persister.getItem('string-test')

        expect(persistedStr).toBeUndefined()
    })

    it('Persist array', async () => {
        const item = ['My string test', 54]
        persister.setItem('array-test', item)

        const persistedStr = await persister.getItem('array-test')

        expect(persistedStr).toStrictEqual(item)
    })

    it('Remove array persisted', async () => {
        persister.removeItem('array-test')

        const persistedStr = await persister.getItem('array-test')

        expect(persistedStr).toBeUndefined()
    })

    it('Persist object', async () => {
        const item = { name: 'My string test', age: 54 }
        persister.setItem('object-test', item)

        const persistedStr = await persister.getItem('object-test')

        expect(persistedStr).toStrictEqual(item)
    })

    it('Remove object persisted', async () => {
        persister.removeItem('object-test')

        const persistedStr = await persister.getItem('object-test')

        expect(persistedStr).toBeUndefined()
    })

    it('Persist number', async () => {
        const item = 54
        persister.setItem('number-test', item)

        const persistedStr = await persister.getItem('number-test')

        expect(persistedStr).toStrictEqual(item)
    })

    it('Get not existing item', async () => {
        const persistedStr = await persister.getItem('not-exist-test')

        expect(persistedStr).toBeUndefined()
    })

    it('Remove number persisted', async () => {
        persister.removeItem('number-test')

        const persistedStr = await persister.getItem('number-test')

        expect(persistedStr).toBeUndefined()
    })

    it('Expect throw Error', async () => {
        // @ts-ignore
        expect(() => new PersisterMock()).toThrowError()
    })
})