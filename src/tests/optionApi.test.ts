import { beforeEach, describe, expect, it } from 'vitest'
import { beforeEachPiniaPlugin, createAppAndPinia } from './utils/beforeEach'
import { useOptionApiStore, type OptionApiState, type OptionApiStore } from '../stores/experiments/optionApi'
import { EppsStore } from '../types'

const declaration = { id: 1, test: 'my test string' }

const newTestStr = 'An another test string'

describe('Option Api store extends correctly store', () => {
    let optionApiStore: EppsStore<OptionApiStore, OptionApiState>

    beforeEach(() => {
        createAppAndPinia()

        if (!optionApiStore) {
            optionApiStore = useOptionApiStore() as EppsStore<OptionApiStore, OptionApiState>
        }
    })

    it('Has setData method and methods defined in actionsToExtends are extended', async () => {
        optionApiStore.setTest(declaration)

        expect(optionApiStore.id).toStrictEqual(declaration.id)
        expect(optionApiStore.test).toStrictEqual(declaration.test)
    })

    it('Access state property and change value', async () => {
        if (optionApiStore) {
            optionApiStore.test = newTestStr
            optionApiStore.id = 2

            expect(optionApiStore.test).toStrictEqual(newTestStr)
            expect(optionApiStore.id).toStrictEqual(2)
        }
    })
})