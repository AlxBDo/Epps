import { Store } from "pinia"
import { AnyObject, DefineEppsStore, EppsStore } from "."
import ParentStoreClass from "../plugins/parentStore"


export interface ParentStoreInterface {
    get id(): string
    build: (childId: string) => EppsStore<AnyObject, AnyObject>
}


export type ParentStore = (
    <TStore = AnyObject, TState = AnyObject>(id: string) => (DefineEppsStore<TStore, TState> | Store)
)

export type ParentStoreConstructor = (() => DefineEppsStore<AnyObject, AnyObject> | Store) | ParentStoreClass