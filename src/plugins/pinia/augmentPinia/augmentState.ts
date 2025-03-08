import { ref, type Ref } from "vue"

import type { StateTree } from "pinia"
import type { AnyObject } from "../../../types"



/**
 * Add state properties to state
 * @param {string[]} properties 
 * @param {StateTree} state 
 * @param {boolean} isOptionApi 
 * @param {AnyObject|undefined} values 
 */
export function addPropertiesToState(
    properties: string[],
    state: StateTree,
    isOptionApi: boolean,
    values?: AnyObject
): void {
    properties.forEach(
        (property: string) => addToState(property, state, isOptionApi, values ? values[property] : undefined)
    )
}

export function addToState<T>(name: string, state: StateTree, isOptionApi: boolean, value?: T): void {
    state[name] = isOptionApi ? value : ref<T | undefined>(value)
}

export function getStatePropertyValue(property: any | Ref<any>) {
    return property?.value ?? property
}