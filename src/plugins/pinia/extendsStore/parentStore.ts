import type { Store } from "pinia"
import type { AnyObject } from "../../../types"


/**
 * Provides the parent store by its id or index
 * @param {string | number} parentStoreIdOrIndex - The id or index of the parent store
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStore(parentStoreIdOrIndex: string | number, parentsStores: Store[]): Store | undefined {
    let parentStore: Store | undefined
    if (typeof parentStoreIdOrIndex === 'string') {
        parentStore = getParentStoreById(parentStoreIdOrIndex, parentsStores)
    } else if (typeof parentStoreIdOrIndex === 'number') {
        parentStore = getParentStoreByIndex(parentStoreIdOrIndex, parentsStores)
    }

    return parentStore
}

/**
 * Provides the parent store by its id
 * @param {string} parentStoreId 
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStoreById(parentStoreId: string, parentsStores: Store[]): Store | undefined {
    return parentsStores.find((store) => store.$id === parentStoreId)
}

/**
 * Provides the parent store by its index
 * @param {number} parentStoreIndex 
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStoreByIndex(parentStoreIndex: number, parentsStores: Store[]): Store | undefined {
    return parentsStores[parentStoreIndex]
}

/**
 * Provides the parent store property value
 * @param {string} propertyName 
 * @param {AnyObject | string | number | undefined} parentStore 
 * @param {Store[]} parentsStores 
 * @returns any
 */
export function getParentStorePropertyValue(
    propertyName: string,
    parentStore: AnyObject | string | number | undefined,
    parentsStores?: Store[]
): any {
    if (!parentsStores) { return }

    if (typeof parentStore === 'string' || typeof parentStore === 'number') {
        parentStore = getParentStore(parentStore, parentsStores)
    }

    if (typeof parentStore === 'object') {
        return parentStore[propertyName]
    }
}