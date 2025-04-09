import type { Store } from "pinia"
import type { AnyObject, EppsStore } from "../types"


/**
 * Provides the parent store by its id or index
 * @param {string | number} parentStoreIdOrIndex - The id or index of the parent store
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStore(
    parentStoreIdOrIndex: string | number,
    parentsStores: Array<Store | EppsStore<AnyObject, AnyObject>>
): Store | undefined {
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
    parentsStores?: Store[] | EppsStore<AnyObject, AnyObject>[]
): any {
    if (!parentsStores) { return }

    if (typeof parentStore === 'string' || typeof parentStore === 'number') {
        parentStore = parentsStores && getParentStore(parentStore, parentsStores)
    }

    if (typeof parentStore === 'object') {
        return parentStore[propertyName]
    }
}

/**
 * Provides the parent store method
 * @param {string} methodName 
 * @param {AnyObject | string | number | undefined} parentStore 
 * @param {Store[] | EppsStore<AnyObject, AnyObject>[]} parentsStores 
 * @returns Function
 */
export function getParentStoreMethod(
    methodName: string,
    parentStore: AnyObject | string | number | undefined,
    parentsStores?: Store[] | EppsStore<AnyObject, AnyObject>[]
): Function {
    if (parentsStores) {
        if (typeof parentStore === 'string' || typeof parentStore === 'number') {
            parentStore = parentsStores && getParentStore(parentStore, parentsStores)
        }

        if (typeof parentStore === 'object') {
            const method = parentStore[methodName]

            if (typeof method === 'function') {
                return method
            }
        }
    }

    return () => { }
}