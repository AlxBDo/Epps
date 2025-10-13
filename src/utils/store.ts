import { defineStore, DefineStoreOptions, StateTree } from "pinia"
import type { Item } from "../models/item"
import type { AnyObject } from "../types"
import type { DefineEppsStore, EppsStoreOptions } from "../types/store"
import { Epps } from "../plugins/epps"


export const itemState: Item = {
    '@id': undefined,
    id: undefined
}

export interface DefineEppsStoreOtions extends EppsStoreOptions {
    eppsOptions?: Epps
}

export function defineEppsStore<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'> | (() => AnyObject),
    options?: DefineEppsStoreOtions | Epps | EppsStoreOptions
): DefineEppsStore<Sto, Sta> {
    if (options) {
        options = { eppsOptions: options instanceof Epps ? options : new Epps(options) }
    }

    return typeof storeDefinition === 'function'
        ? defineEppsStoreSetup(
            id,
            storeDefinition,
            options
        )
        : defineEppsStoreOptionApi(
            id,
            storeDefinition,
            options
        )
}

export function defineEppsStoreSetup<Sto, Sta>(
    id: string,
    storeDefinition: () => AnyObject,
    options?: EppsStoreOptions
): DefineEppsStore<Sto, Sta> {
    return defineStore(id, storeDefinition, options) as unknown as DefineEppsStore<Sto, Sta>
}

export function defineEppsStoreOptionApi<Sto, Sta>(
    id: string,
    storeDefinition: Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'>,
    options?: EppsStoreOptions
): DefineEppsStore<Sto, Sta> {
    if (options) {
        storeDefinition = { ...storeDefinition, ...(options ?? {}) } as Omit<DefineStoreOptions<string, StateTree & Sta, AnyObject, Partial<Sto>>, 'id'>
    }

    return defineStore(id, storeDefinition) as unknown as DefineEppsStore<Sto, Sta>
}