import type { AnyObject, SearchCollectionCriteria } from "../types";


export function arrayObjectFindAllBy<T extends AnyObject>(
    arrayOfObject: T[],
    findBy: SearchCollectionCriteria & Partial<T>,
    strict: boolean = true
): T[] {
    return arrayOfObject.filter(
        (item: T) => Object.keys(findBy).every(
            (key: string) => {
                let itemKey = item[key]
                const typeOfItemKey = typeof itemKey

                if (typeOfItemKey === 'string') {
                    itemKey = itemKey.toLowerCase()
                }

                const findByKey = typeof findBy[key] === 'string' ? findBy[key].toLowerCase() : findBy[key]

                return strict ? itemKey == findByKey : itemKey.indexOf(findByKey) >= 0
            }
        )
    );
}

export function arrayObjectFindBy<T extends AnyObject>(arrayOfObject: T[], findBy: SearchCollectionCriteria & Partial<T>): T | undefined {
    return arrayOfObject.find((item: T) => Object.keys(findBy).every((key: string) => item[key] === findBy[key]));
}