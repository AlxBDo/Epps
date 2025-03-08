import type { Item } from "../models/item"
import { removeItemOfObjectCollection, updateArrayOfObject } from "./object"

export function removeItem(item: Item, items: Item[]): Item[] {
    const findIndexFunction = (i: Item) => i['@id'] === item['@id']
    return removeItemOfObjectCollection(items, findIndexFunction) as Item[]
}

export function updateItems(item: Item, items: Item[]): Item[] {
    const findFunction = (i: Item) => i['@id'] === item['@id']
    return updateArrayOfObject(findFunction, item, items) as Item[]
}