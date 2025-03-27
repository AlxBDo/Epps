import { AnyObject } from "../..";
import { ClientStorage } from "../../types/storage";

let store: AnyObject = {}

export const localStorageMock: ClientStorage = {
    clear: () => store = {},
    getItem: (key: string) => store[key],
    removeItem: (key: string) => delete store[key],
    removeItems: (excludedItems?: any[]) => excludedItems ? excludedItems.forEach((key) => delete store[key]) : (store = {}),
    setItem: (key: string, value: string) => store[key] = value,
}