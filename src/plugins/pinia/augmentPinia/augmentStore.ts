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

        store.$patch(Object.assign({}, initState))

        if (Array.isArray(store.$state?.parentsStores) && store.$state?.parentsStores.length) {
            store.$state?.parentsStores.forEach(
                (parentStore: Store) => parentStore.$reset
            )
        }
    }
}