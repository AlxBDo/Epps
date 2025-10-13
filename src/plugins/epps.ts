import type { ActionFlows, MutationCallback, ParentStoreInterface } from "../types/epps"
import type { AnyObject, EppsStore } from "../types"
import type { EppsStoreOptions, PersistedStoreOptions } from "../types/store"


export interface EppsContructor extends Omit<EppsStoreOptions, 'parentsStores'> {
    parentsStores?: ParentStoreInterface[]
    propertiesToRename?: Record<string, string>
}


export class Epps {
    private _actionFlows?: ActionFlows
    private _actionsToExtends?: string[]
    private _actionsToRename?: Record<string, string>
    private _childId?: string
    private _mutationCallback?: MutationCallback
    private _persist?: PersistedStoreOptions | boolean
    private _parentsStores?: ParentStoreInterface[]
    private _parentsStoresBuilded?: EppsStore<AnyObject, AnyObject>[]
    private _propertiesToRename?: Record<string, string>

    constructor(options: EppsContructor) {
        this._actionFlows = options.actionFlows
        this._actionsToExtends = options.actionsToExtends
        this._actionsToRename = options.actionsToRename
        this._mutationCallback = options.mutationCallback
        this._parentsStores = options.parentsStores
        this._persist = options.persist
        this._propertiesToRename = options.propertiesToRename
    }


    get actionFlows(): ActionFlows | undefined {
        return this._actionFlows
    }

    get actionsToExtends(): string[] | undefined {
        return this._actionsToExtends
    }

    get actionsToRename(): Record<string, string> | undefined {
        return this._actionsToRename
    }

    get childId(): string | undefined {
        return this._childId
    }

    set actionFlows(actionFlows: ActionFlows) {
        this._actionFlows = actionFlows
    }

    set childId(value: string | undefined) {
        this._childId = value
    }

    get persist(): PersistedStoreOptions | boolean | undefined {
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

    hasCustomDb(): boolean {
        return !!(typeof this._persist === 'object' && this._persist?.dbName)
    }

    parentsStores(childId?: string): EppsStore<AnyObject, AnyObject>[] {
        this.buildStores(childId)

        return this._parentsStoresBuilded as EppsStore<AnyObject, AnyObject>[]
    }
}