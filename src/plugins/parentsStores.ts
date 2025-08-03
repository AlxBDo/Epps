import type { Store } from "pinia"
import type { AnyObject, EppsStore } from "../types"
import type { ParentStore as ParentStoreType, ParentStoreConstructor } from "../types/epps"
import ParentStore, { getParentStoreById } from "./parentStore"


export default class ParentsStores {
    private _childId?: string
    private _parentsStores: ParentStoreConstructor[] = []

    get childId(): string | undefined {
        return this._childId
    }

    set childId(childId: string) {
        this._childId = childId
    }

    constructor(parentsStores?: ParentStoreConstructor[]) {
        if (parentsStores) {
            this._parentsStores = parentsStores
        }
    }

    addStore<TStore = AnyObject, TState = AnyObject>(baseId: string, parentStore: ParentStoreType): void {
        this._parentsStores.push(() => parentStore<TStore, TState>(`${baseId}${this.childId ?? ''}`))
    }

    private buidStores(): EppsStore<AnyObject, AnyObject>[] {
        return this._parentsStores.map(
            store => (store instanceof ParentStore ? store.build(this.childId as string) : store()) as EppsStore<AnyObject, AnyObject>
        )
    }

    getStore<TStore, TState>(idOrIndex: number | string): EppsStore<TStore, TState> | undefined {
        if (typeof idOrIndex === 'number') {
            return (
                this._parentsStores[idOrIndex] instanceof ParentStore
                    ? this._parentsStores[idOrIndex].build(this.childId as string)
                    : this._parentsStores[idOrIndex]
            ) as EppsStore<TStore, TState>
        } else {
            return getParentStoreById<TStore, TState>(idOrIndex, this.buidStores())
        }
    }

    getStores() {
        return this.buidStores()
    }
}