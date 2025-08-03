import { describe, expect, it } from 'vitest'

import Store from '../core/Store'

import type { Store as PiniaStore } from 'pinia'
import { ref } from 'vue'

describe('Store', () => {
    const store = new Store({} as PiniaStore, {})
    const initialState = { test: 'my string' }

    it('Store set pinia store state', async () => {
        store.state = initialState

        expect(store.store.$state).toStrictEqual(initialState)
    })

    it('Store add properties to store state', async () => {
        const properties = ['test1', 'test2']
        const values = { test1: ref('value1'), test2: ref('value2') }

        store.addPropertiesToState(properties, values)

        expect(store.store.$state).toStrictEqual({ ...initialState, ...values })
    })
})