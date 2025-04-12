import { describe, expect, it } from 'vitest'

import { areIdentical } from '../utils/validation/object'

type ComplexObject = { property1: { a: number; b: number }; property2?: number[] }

const property1 = { a: 1, b: 2 }
const property2 = [1, 2]
const complexObject1: ComplexObject = { property1, property2 }
const complexObject2: ComplexObject = { property1 }

describe('areIdentical', () => {
    it('Complex objects are not identical if one of property less', async () => {
        expect(areIdentical(complexObject1, complexObject2)).toBeFalsy()
    })

    it('Complex objects are not identical if have same structure but value not', async () => {
        const complexObject3 = {
            property1: { a: { a: 1, b: 2 }, b: 2 },
            property2: [{ a: 1, b: 2 }, [1, 2]]
        }

        const complexObject4 = {
            property1: { a: { a: 2, b: 2 }, b: 2 },
            property2: [{ a: 1, b: 2 }, [1, 2]]
        }

        expect(areIdentical(complexObject3, complexObject4)).toBeFalsy()

        const complexObject5 = {
            property1: [{ a: 1, b: 2 }, [1, 2]],
            property2: { a: { a: 1, b: 2 }, b: 2 }
        }

        const complexObject6 = {
            property1: [{ a: 1, b: undefined }, [1, 2]],
            property2: { a: { a: 1, b: 2 }, b: 2 }
        }

        expect(areIdentical(complexObject5, complexObject6)).toBeFalsy()

        const complexObject7 = {
            property1: [1, 2]
        }

        const complexObject8 = {
            property1: [1, 1]
        }

        expect(areIdentical(complexObject7, complexObject8)).toBeFalsy()
    })

    it('Complex objects are identical if excludedKeys contains different property', async () => {
        expect(areIdentical(complexObject1, complexObject2, ['property2'])).toBeTruthy()
    })

    it('Complex objects are identical', async () => {
        complexObject2.property2 = property2
        expect(areIdentical(complexObject1, complexObject2)).toBeTruthy()
    })
})