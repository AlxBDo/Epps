export function isEmpty(value: any): boolean {
    if (!value) {
        return typeof value === 'boolean' || typeof value === 'number'
    }

    if (Array.isArray(value)) {
        return value.length === 0
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0
    }

    if (typeof value === 'string') {
        return value === ''
    }

    return false
}