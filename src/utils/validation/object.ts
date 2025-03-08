import type { AnyObject } from "../../types"

const logStyleOptions = {
    bgColor: '#d8b32b',
    icon: '☢️'
}

/**
 * Compares objects to determine if they are identical
 * @param {object} object1 
 * @param {object} object2 
 * @param {array} excludedKeys - name of properties not to be compared
 * @returns {boolean} areIdentical
 */
export const areIdentical = (object1: AnyObject, object2: AnyObject, excludedKeys?: string[]) => {
    if (!object2 || (!excludedKeys && object1.length !== object2.length)) {
        return false
    }

    return Object.keys(object1).reduce((acc, key) => {
        if (acc && (!excludedKeys || !excludedKeys.includes(key))) {
            if (!object1[key] || !object2[key]) {
                acc = object1[key] === object2[key]
            } else if (Array.isArray(object1[key])) {
                acc = object1[key].length === object2[key]?.length
                acc && object1[key].forEach((item: any, index: number) => {
                    if (!acc) { return acc }
                    if (typeof item === 'object') {
                        acc = areIdentical(item, object2[key][index]);
                    } else if (item !== object2[key][index]) {
                        acc = false
                    }
                })
            } else if (typeof object1[key] === 'object') {
                acc = areIdentical(object1[key], object2[key])
            } else { acc = object1[key] === object2[key] }
        }

        return acc
    }, true)
}