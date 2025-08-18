import type { EppsStore, ExtendedState } from "../types/store";
import type { Store } from "pinia";

import { ref, type Ref } from "vue";


export interface ExtendedStateOptions {
    actionsToExtends?: string[]
    isExtended?: boolean
    isOptionApi?: boolean
    persist?: PersistOptions
}

export interface PersistOptions {
    excludedKeys?: string[] | Ref<string[]>,
    isEncrypted?: boolean | Ref<boolean>,
    persist?: boolean | Ref<boolean>
    persistedPropertiesToEncrypt?: string[] | Ref<string[]>,
    watchMutation?: boolean | Ref<boolean>
}


const defaultExtendedStateOptions: ExtendedStateOptions = {
    actionsToExtends: [],
    isOptionApi: false
}

const defaultPersistEcludedKey = ['actionsToExtends', 'isExtended', 'isOptionApi', 'parentsStores']

const defaultPersistOptionsApi = {
    excludedKeys: defaultPersistEcludedKey,
    isEncrypted: false,
    persist: true,
    persistedPropertiesToEncrypt: [],
    watchMutation: false
}

const defaultPersistOptionsSetup = {
    excludedKeys: ref(defaultPersistEcludedKey),
    isEncrypted: ref(false),
    persist: ref(true),
    persistedPropertiesToEncrypt: ref([]),
    watchMutation: ref(false)
}


export const extendedState = <TStore, TState>(
    parentsStoresProps: Store[] | EppsStore<TStore, TState>[],
    options?: ExtendedStateOptions

): ExtendedState => {
    let {
        actionsToExtends,
        isExtended,
        isOptionApi,
        persist
    }: ExtendedStateOptions = { ...defaultExtendedStateOptions, ...options }

    const parentsStores = () => parentsStoresProps

    if (persist) {
        if (isOptionApi) {
            if (Array.isArray(persist.excludedKeys)) {
                persist.excludedKeys = [...defaultPersistEcludedKey, ...persist.excludedKeys]
            }

            persist = { ...defaultPersistOptionsApi, ...persist }
        } else {
            if (persist.excludedKeys && typeof persist.excludedKeys === 'object') {
                const excludedKeys = !Array.isArray(persist.excludedKeys) ? persist.excludedKeys?.value : []
                persist.excludedKeys = ref([...defaultPersistEcludedKey, ...excludedKeys])
            }

            const defaultPersistOptions = isOptionApi ? defaultPersistOptionsApi : defaultPersistOptionsSetup
            persist = { ...defaultPersistOptions, ...persist }
        }
    }

    return isOptionApi ? ({
        ...persist,
        actionsToExtends,
        isExtended,
        isOptionApi,
        parentsStores
    }) : ({
        ...persist,
        actionsToExtends: ref<string[] | undefined>(actionsToExtends),
        isExtended: ref<boolean | undefined>(isExtended),
        isOptionApi: ref<boolean | undefined>(isOptionApi),
        parentsStores
    })
}