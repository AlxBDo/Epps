import { PiniaPluginContext, Store } from "pinia"
import { addToState } from "../augmentPinia/augmentState"
import { isOptionApi } from "../augmentPinia/augmentStore"
import { getExcludedKeys } from "./getExludedKeys"
import { getPersistedState, getPersister, getStoreName, persist, storeSubscription, storesWatched } from "./persistStore"
import { log } from "../../../utils/log"


/**
 * Adds state's properties and methods necessary for store persistence
 * @param {Store} store 
 */
export function augmentStore({ store }: PiniaPluginContext) {
    const state = store.$state
    const optionApi = isOptionApi({ store } as PiniaPluginContext)

    // Augment state

    if (!state.hasOwnProperty('isEncrypted')) {
        addToState<boolean>('isEncrypted', state, optionApi, false)
    }

    if (!state.hasOwnProperty('persist')) {
        addToState<boolean>('persist', state, optionApi, false)
    }

    if (!state.hasOwnProperty('persistedPropertiesToEncrypt')) {
        addToState<string[]>('persistedPropertiesToEncrypt', state, optionApi, [])
    }

    if (!state.hasOwnProperty('watchMutation')) {
        addToState<boolean>('watchMutation', state, optionApi, false)
    }

    addToState<string[]>('excludedKeys', state, optionApi, getExcludedKeys(state))


    // Augment Store
    store.persistState = () => persist(state, store)
    store.remember = async () => remember(store)
    store.removePersistedState = () => removePersistedState(getStoreName(store))

    if (!storesWatched.includes(getStoreName(store))) {
        store.watch = () => {
            addToState<boolean>('watchMutation', state, optionApi, true)
            storeSubscription({ store } as PiniaPluginContext)
        }
    }
}

async function remember(store: Store) {
    const persistedState = await getPersistedState(getStoreName(store), store.$state)

    if (persistedState) {
        store.$patch(persistedState)
    }
}

function removePersistedState(storeName: string) {
    getPersister().removeItem(storeName)
}