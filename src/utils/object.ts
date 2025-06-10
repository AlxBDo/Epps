import type { AnyObject, SearchCollectionCriteria } from "../types";


export function arrayObjectFindAllBy<T extends AnyObject>(
    arrayOfObject: T[],
    findBy: SearchCollectionCriteria & Partial<T>,
    strict: boolean = true
): T[] {
    return arrayOfObject.filter(
        (item: T) => Object.keys(findBy).every(
            (key: string) => {
                const itemKey = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key]
                const findByKey = typeof findBy[key] === 'string' ? findBy[key].toLowerCase() : findBy[key]

                return strict ? itemKey == findByKey : itemKey.includes(findByKey)
            }
        )
    );
}

export function arrayObjectFindBy<T extends AnyObject>(arrayOfObject: T[], findBy: SearchCollectionCriteria & Partial<T>): T | undefined {
    return arrayOfObject.find((item: T) => Object.keys(findBy).every((key: string) => item[key] === findBy[key]));
}