import { Store } from "pinia"
import { AnyObject, DefineEppsStore } from "."
import ParentStoreClass from "../plugins/parentStore"

export type ParentStore = (
    <TStore = AnyObject, TState = AnyObject>(id: string) => (DefineEppsStore<TStore, TState> | Store)
)
export type ParentStoreConstructor = (() => DefineEppsStore<AnyObject, AnyObject> | Store) | ParentStoreClass