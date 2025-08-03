import { PersistOptions } from "./extendedState"
import type { AnyObject, EppsStore } from "../types"
import type { EppsStoreOptions, PersistedStoreOptions } from "../types/store"
import ParentStore, { getParentStoreById } from "./parentStore"


export interface EppsContructor extends Omit<EppsStoreOptions, 'parentsStores'> {
    parentsStores?: ParentStore[]
    propertiesToRename?: Record<string, string>
}


export class Epps {
    private _actionsToExtends?: string[]
    private _childId?: string
    private _persist?: PersistedStoreOptions
    private _parentsStores?: ParentStore[]
    private _parentsStoresBuilded?: EppsStore<AnyObject, AnyObject>[]
    private _propertiesToRename?: Record<string, string>

    constructor(options: EppsContructor) {
        this._actionsToExtends = options.actionsToExtends
        this._parentsStores = options.parentsStores
        this._persist = options.persist
        this._propertiesToRename = options.propertiesToRename
    }


    get actionsToExtends(): string[] | undefined {
        return this._actionsToExtends
    }

    get childId(): string | undefined {
        return this._childId
    }

    set childId(value: string | undefined) {
        this._childId = value
    }

    get persist(): PersistOptions | undefined {
        return this._persist
    }

    get propertiesToRename(): Record<string, string> | undefined {
        return this._propertiesToRename
    }

    buildStores(childId?: string): void {
        if (!this._childId && !childId) {
            return
        }

        this._parentsStoresBuilded = this._parentsStores?.map(
            store => store.build((childId ?? this.childId) as string) as EppsStore<AnyObject, AnyObject>
        )
    }

    getStore<TStore, TState>(idOrIndex: number | string, childId?: string): EppsStore<TStore, TState> | undefined {
        if (!this._parentsStores) {
            return undefined
        }

        if (typeof idOrIndex === 'string') {
            const store = this._parentsStores.find(store => store.id === idOrIndex)

            if (!store) { return }

            return store.build(childId as string) as EppsStore<TStore, TState>
        }

        if (typeof idOrIndex === 'number') {
            return this._parentsStores[idOrIndex].build(childId as string) as EppsStore<TStore, TState>
        }
    }

    getStores(childId?: string) {
        return this.parentsStores(childId)
    }

    parentsStores(childId?: string): EppsStore<AnyObject, AnyObject>[] {
        this.buildStores(childId)

        return this._parentsStoresBuilded as EppsStore<AnyObject, AnyObject>[]
    }
}