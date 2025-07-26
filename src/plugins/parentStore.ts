import type { Store } from "pinia"
import type { AnyObject, EppsStore } from "../types"


/**
 * Provides the parent store by its id or index
 * @param {string | number} parentStoreIdOrIndex - The id or index of the parent store
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStore<TStore = AnyObject, TState = AnyObject>(
    parentStoreIdOrIndex: string | number,
    parentsStores: Array<Store | EppsStore<TStore, TState>> | (() => Array<Store | EppsStore<AnyObject, AnyObject>>)
): EppsStore<TStore, TState> | undefined {
    let parentStore: EppsStore<TStore, TState> | undefined

    if (typeof parentsStores === 'function') {
        parentsStores = parentsStores()
    }

    if (typeof parentStoreIdOrIndex === 'string') {
        parentStore = getParentStoreById<TStore, TState>(parentStoreIdOrIndex, parentsStores)
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
export function getParentStoreById<TStore = AnyObject, TState = AnyObject>(
    parentStoreId: string,
    parentsStores: Array<Store | EppsStore<TStore, TState>>
): EppsStore<TStore, TState> | undefined {
    return parentsStores.find((store) => store.$id === parentStoreId) as EppsStore<TStore, TState>
}

/**
 * Provides the parent store by its index
 * @param {number} parentStoreIndex 
 * @param {Store[]} parentsStores 
 * @returns Store | undefined
 */
export function getParentStoreByIndex<TStore = AnyObject, TState = AnyObject>(
    parentStoreIndex: number,
    parentsStores: Array<Store | EppsStore<TStore, TState>>
): EppsStore<TStore, TState> | undefined {
    return parentsStores[parentStoreIndex] as EppsStore<TStore, TState>
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
    parentStore: AnyObject | string | number,
    parentsStores?: Store[] | EppsStore<AnyObject, AnyObject>[]
): any {
    if (parentsStores && (typeof parentStore === 'string' || typeof parentStore === 'number')) {
        parentStore = getParentStore(parentStore, parentsStores) as AnyObject
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
    parentStore: AnyObject | string | number,
    parentsStores?: Store[] | EppsStore<AnyObject, AnyObject>[]
): Function {
    if (parentsStores && typeof parentStore === 'string' || typeof parentStore === 'number') {
        parentStore = getParentStore(parentStore, parentsStores as Store[]) as AnyObject
    }

    if (typeof parentStore === 'object') {
        const method = parentStore[methodName]

        if (typeof method === 'function') {
            return method
        }
    }

    return () => { }
}