import type { PiniaPluginContext, StateTree, SubscriptionCallbackMutation } from "pinia"
import type { AnyObject } from "../../../types"
import { areIdentical } from "../../../utils/validation/object"
import { cryptState } from "./cryptState"
import Persister from "../../../services/Persister"
import { toRaw } from "vue"
import { StorageItemObject } from "../../../types/storage"
import { Epps } from "../../epps"
import { pluginName } from "../../../utils/constantes"
import { getExcludedKeys } from "./getExludedKeys"
import { augmentStore } from "./augmentStore"
import { log, logError } from "../../../utils/log"


const logStyleOptions = { bgColor: 'black', icon: '☁️' }


let augmentPinia: Epps

let persister: undefined | Persister

export const storesWatched: string[] = []


export async function getPersistedState(storeName: string, state?: StateTree): Promise<StateTree | undefined> {
    try {
        let persistedState = await getPersister().getItem(storeName) as StorageItemObject | undefined

        if (state && state.hasOwnProperty('persistedPropertiesToEncrypt') && persistedState && augmentPinia.crypt) {
            persistedState = cryptState(augmentPinia.crypt, { ...toRaw(state), ...persistedState }, true)
        }

        return persistedState
    } catch (e) {
        logError('getPersistedState Error', [storeName, e])
    }
}

export function getPersister(): Persister {
    if (!persister) {
        persister = augmentPinia.db
    }

    return persister
}

export function getStoreName(store: AnyObject): string {
    return store.hasOwnProperty('getStoreName') ? store.getStoreName() : store.$id
}

export async function persist(state: StateTree, store: AnyObject) {
    const storeName = getStoreName(store)
    let persistedState = await getPersistedState(storeName)

    if (state.hasOwnProperty('persistedPropertiesToEncrypt') && augmentPinia.crypt) {
        state = cryptState(augmentPinia.crypt, state)
        if (persistedState) { persistedState = cryptState(augmentPinia.crypt, persistedState) }
    }

    const newState = populateState(state, persistedState)


    /** 
    log(
        `persistStore persist ${getStoreName(store)}`,
        [
            'areIdentical',
            areIdentical(newState, persistedState ?? {}, getExcludedKeys(state)),
            'newState',
            newState,
            'persistedState',
            persistedState,
            'state',
            state,
            'store',
            store
        ]
    )
     */

    if (!persistedState || !areIdentical(newState, persistedState, getExcludedKeys(state))) {
        getPersister().setItem(storeName, newState)
    }
}

export function persistStorePlugin(context: PiniaPluginContext, pluginOptions: Epps) {
    if (!pluginOptions) {
        new Error(`${pluginName} - PluginOptions is required`)
    }

    const { store } = context
    const state = store.$state
    augmentPinia = pluginOptions

    if (state && state.hasOwnProperty('persist')) {
        if (state.persist && state?.watchMutation) {
            storeSubscription(context)
        }

        augmentStore(context)
    }
}

function populateState(state: StateTree, persistedState?: StateTree) {
    let excludedKeys = getExcludedKeys(state)

    const deniedFirstChar = ['_', '$']

    return Object.keys(state).reduce((acc: StateTree, curr: string) => {

        if (!deniedFirstChar.includes(curr[0]) && !excludedKeys.includes(curr)) {

            if (!state[curr] && (persistedState && persistedState[curr])) {
                acc[curr] = persistedState[curr];
            } else {
                if (Array.isArray(state[curr])) {
                    acc[curr] = state[curr].map((item: any) => typeof item === "object" ? populateState(item) : toRaw(item))
                } else if (typeof state[curr] === 'object') {
                    if (state[curr]?.__v_isRef) {
                        acc[curr] = state[curr]?.value
                    } else {
                        acc[curr] = populateState(state[curr], persistedState && persistedState[curr])
                    }
                } else {
                    acc[curr] = toRaw(state[curr])
                }
            }
        }
        return acc
    }, {} as StateTree)
}

export function storeSubscription({ store }: PiniaPluginContext) {
    if (storesWatched.includes(getStoreName(store))) {
        return
    }

    storesWatched.push(getStoreName(store))

    store.$subscribe((mutation: SubscriptionCallbackMutation<StateTree>, state) => {
        if (mutation.type !== 'patch object' && mutation?.events) {
            const { newValue, oldValue } = mutation.events as AnyObject

            if (!newValue || typeof newValue === 'function') {
                return
            }

            persist(toRaw(state), store)

            if (
                (typeof newValue === 'object' ? !areIdentical(newValue, oldValue) : newValue !== oldValue)
                && store.mutationCallback
            ) {
                store.mutationCallback(mutation)
            }
        }
    })
}
