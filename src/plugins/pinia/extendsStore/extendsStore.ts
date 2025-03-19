import type { PiniaPluginContext, StateTree, Store } from "pinia";
import type { AnyObject } from "../../../types";
import { addPropertiesToState, addToState } from "../augmentPinia/augmentState";
import { augmentStore } from "../persistStore/augmentStore";
import { isOptionApi } from "../augmentPinia/augmentStore";
import type { PersistedState, PersistedStore, ExtendedStore } from "../../../types/store";
import { computed, ref } from "vue";
import { log } from "../../../utils/log";


const logStyleOptions = { bgColor: 'green', icon: '☁️' }


const extendedActions = ['removePersistedState', 'watch', '$reset']

/**
 * Create computed function to extend store property
 * @param {AnyObject} store 
 * @param {string} key 
 * @returns computed function
 */
function createComputed(store: AnyObject, key: string) {
    const isObject = typeof store[key] === 'object'

    return computed({
        get: () => {
            return isObject ? (store[key]?.value ?? store[key]) : store[key]
        },
        set: (value: any) => {
            if (isObject && store[key]?.value) {
                store[key].value = value
            } else { store[key] = value }
        }
    })
}

/**
 * Extends storeToExtend's action to extendedStore
 * @param {AnyObject} storeToExtend 
 * @param {AnyObject} extendedStore 
 * @param {string} key 
 */
function extendsAction(storeToExtend: AnyObject, extendedStore: AnyObject, key: string): void {
    const originalFunction = extendedStore[key];

    if (extendedStore.$state.isOptionApi) {
        extendedStore[key] = function (...args: any[]) {
            storeToExtend[key].apply(this, args);
            originalFunction.apply(this, args);
        }
    } else {
        extendedStore[key] = (...args: any[]) => {
            storeToExtend[key](...args);
            originalFunction(...args);
        }
    }
}

/**
 * Duplicates storeToExtend to extendedStore
 * @param {AnyObject} storeToExtend 
 * @param {AnyObject} extendedStore 
 */
function duplicateStore(storeToExtend: AnyObject, extendedStore: AnyObject): void {
    const deniedFirstChars = ['$', '_']

    Object.keys(storeToExtend).forEach((key: string) => {
        if (deniedFirstChars.includes(key[0]) && key !== '$reset') { return }

        const typeOfProperty = typeof storeToExtend[key]

        if (typeOfProperty === 'function') {
            if (
                extendedStore.hasOwnProperty(key) && (
                    extendedActions.includes(key) || (
                        (Array.isArray(extendedStore?.actionsToExtends) && extendedStore?.actionsToExtends.includes(key))
                        || (extendedStore?.actionsToExtends.value && extendedStore?.actionsToExtends.value.includes(key))
                    )
                )
            ) {
                extendsAction(storeToExtend, extendedStore, key)
            } else if (!extendedStore.hasOwnProperty(key)) {
                extendedStore[key] = storeToExtend[key];
            }
        } else if (
            !extendedStore.hasOwnProperty(key) &&
            (typeOfProperty === 'undefined' || typeOfProperty === 'object')
        ) {
            extendedStore[key] = createComputed(storeToExtend, key)
        }
    })
}

/**
 * Create “computed” in extendedStore to extend state properties of storeToExtend
 * @param {AnyObject} storeToExtend 
 * @param {AnyObject} extendedStore 
 */
function extendsStateToComputed(storeToExtend: AnyObject, extendedStore: AnyObject) {
    Object.keys(storeToExtend.$state).forEach((key: string) => {
        if (!extendedStore.$state.hasOwnProperty(key)) {
            extendedStore[key] = createComputed(storeToExtend.$state, key)
        }
    })
}

/**
 * Extends to store stores list in parentsStores property
 * @param {PiniaPluginContext} context 
 */
export function extendsStore({ store }: PiniaPluginContext): void {
    if (store.hasOwnProperty('parentsStores')) {
        const storeToExtend: Store[] = store.parentsStores()

        if (!storeToExtend || !storeToExtend.length) { return }

        const persist = store.$state.hasOwnProperty('persist') && (store.$state.persist?.value ?? store.$state.persist)

        storeToExtend.forEach((ste: Store) => {
            if (ste?.$state) {
                if (persist) {
                    persistChildStore({ store: ste } as PiniaPluginContext, store.$state)
                }

                duplicateStore(ste, store)
                extendsStateToComputed(ste, store)
            }
        })

        store.$state.isExtended = true
    }
}

/**
 * Add state properties necessary to persist
 * @param {StateTree} state 
 * @param {StateTree} childStoreState 
 */
function persistChildStore({ store }: PiniaPluginContext, childStoreState: StateTree) {
    const state = store.$state

    addPropertiesToState(
        ['excludedKeys', 'persist', 'persistedPropertiesToEncrypt'],
        state,
        isOptionApi({ store } as PiniaPluginContext),
        childStoreState
    )

    augmentStore({ store } as PiniaPluginContext)

    runPersist(store as ExtendedStore<PersistedStore, PersistedState>)

    const parentsStores = typeof store.parentsStores === 'function' && store.parentsStores()

    if (Array.isArray(parentsStores) && parentsStores.length) {
        parentsStores.forEach((parentStore: Store) => persistChildStore(
            { store: parentStore } as PiniaPluginContext, store.$state
        ))
    }
}

function runPersist(store: ExtendedStore<PersistedStore, PersistedState>) {
    store.remember()
    store.watch && store.watch()
}