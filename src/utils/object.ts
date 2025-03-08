import type { AnyObject, SearchCollectionCriteria } from "../types";


type TConditionFunction = (item: AnyObject) => boolean

export interface IValueLabelObject {
    icon?: string;
    label: string;
    value: string;
}


export function arrayObjectGroupBy(arrayOfObject: AnyObject[], groupByKey: string): AnyObject {
    return arrayOfObject.reduce((acc: AnyObject, curr: AnyObject) => {
        const currType = curr[groupByKey]
        if (currType) {
            if (!acc[currType]) { acc[currType] = [] }
            acc[currType].push(curr)
        }
        return acc
    }, {})
}

export function arrayObjectFindAllBy<T extends AnyObject>(
    arrayOfObject: T[],
    findBy: SearchCollectionCriteria & Partial<T>,
    strict: boolean = true
): T[] {
    return arrayOfObject.filter(
        (item: T) => Object.keys(findBy).every(
            (key: string) => {
                const itemKey = item[key].toLowerCase()
                const findByKey = typeof findBy[key] === 'string' ? findBy[key].toLowerCase() : findBy[key]

                return strict ? itemKey === findByKey : itemKey.indexOf(findByKey) >= 0
            }
        )
    );
}

export function arrayObjectFindBy<T extends AnyObject>(arrayOfObject: T[], findBy: SearchCollectionCriteria & Partial<T>): T | undefined {
    return arrayOfObject.find((item: T) => Object.keys(findBy).every((key: string) => item[key] === findBy[key]));
}

export function mapObjectFromModel<T extends AnyObject>(model: T, objectProperties?: Partial<T>) {
    return Object.keys(model).reduce((acc, curr) => {
        acc[curr] = (objectProperties && objectProperties[curr]) ?? model[curr]
        return acc
    }, {} as AnyObject) as T
}

export function mapValueLabelObjects(values: string[], labels: AnyObject, icons?: AnyObject): IValueLabelObject[] {
    return values.map((value) => {
        const icon = icons && icons[value]
        return { value, label: labels[value], icon }
    });
}

export function sortArrayObjectFromStringArray<T extends AnyObject>(
    inputs: T[],
    sortedProperties: string[],
    referenceProperty: keyof T = 'name'
): T[] {
    return inputs.sort(
        (a: T, b: T): number => {
            return (a[referenceProperty] && b[referenceProperty])
                ? sortedProperties.indexOf(a[referenceProperty]) - sortedProperties.indexOf(b[referenceProperty])
                : 1
        }
    );
}