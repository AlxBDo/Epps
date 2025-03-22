import type { PiniaPluginContext, StateTree, Store } from "pinia";
import { log } from "../../../utils/log";


export function isOptionApi({ store }: PiniaPluginContext): boolean {
    return store._isOptionsAPI
}

export function rewriteResetStore({ store }: PiniaPluginContext, initState: StateTree): void {

    store.$reset = () => {
        if (store.$state.persist) {
            store.removePersistedState()
        }

        const parentsStores = typeof store.parentsStores === 'function' && store.parentsStores()

        if (Array.isArray(parentsStores) && parentsStores.length) {
            parentsStores.forEach(
                (parentStore: Store) => parentStore.$reset()
            )
        }

        store.$patch(Object.assign({}, initState))
    }
}