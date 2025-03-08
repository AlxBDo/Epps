import { StateTree } from "pinia"

const neverPersist = [
    '@context',
    'activeLink',
    'computed',
    'dep',
    'fn',
    'isEncrypted',
    'isLoading',
    'persist',
    'persistedPropertiesToEncrypt',
    'subs',
    'version',
    'watchMutation'
]


export function getExcludedKeys(state: StateTree): string[] {
    let { excludedKeys } = state

    if (!excludedKeys) {
        excludedKeys = []
    } else if (!Array.isArray(excludedKeys)) {
        excludedKeys = excludedKeys?.value ?? []
    }

    if (!excludedKeys.includes('excludedKeys')) { excludedKeys.push('excludedKeys') }
    if (!excludedKeys.includes('@context')) { excludedKeys = [...excludedKeys, ...neverPersist] }

    return excludedKeys
}