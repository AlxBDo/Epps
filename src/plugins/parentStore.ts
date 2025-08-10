import type { AnyObject, EppsStore } from "../types"
import type { ParentStoreInterface, ParentStore as ParentStoreType } from "../types/epps"


export default class ParentStore implements ParentStoreInterface {
    private _storeConstructor: ParentStoreType
    private _id: string

    get id(): string { return this._id }

    constructor(id: string, store: ParentStoreType) {
        this._storeConstructor = store
        this._id = id
    }

    build(childId: string) {
        childId = childId ? `${childId.substring(0, 1)}${childId.substring(1)}` : ''
        return this._storeConstructor(`${this._id}${childId}`) as EppsStore<AnyObject, AnyObject>
    }
}