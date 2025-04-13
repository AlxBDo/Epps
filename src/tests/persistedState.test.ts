import { describe, expect, it } from 'vitest'

import { persistedState } from '../utils/store'

const persist = true
const persistedPropertiesToEncrypt = ['encryptedProperty']
const excludedKeys = ['excludedProperty']
const isEncrypted = false

describe('persistedState()', () => {
    const persistedStateTest = persistedState(persist, persistedPropertiesToEncrypt, excludedKeys, isEncrypted)

    it('Has persist, persistedPropertiesToEncrypt, excludedKeys and isEncrypted properties', async () => {
        expect(persistedStateTest).toStrictEqual({ persist, persistedPropertiesToEncrypt, excludedKeys, isEncrypted })
    })
})