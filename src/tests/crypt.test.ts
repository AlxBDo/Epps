import { describe, expect, it } from 'vitest'

import { beforeEachPiniaPlugin } from './utils/beforeEach'
import Crypt from "../services/Crypt";

describe('connectedUserStore extends userStore, contactStore and itemStore', () => {
    const crypt = new Crypt('HrN2t2nCr6pTiV22', 'HrN2t2nCr6pTkEy20221l2B3dOcPr4j2')
    const str = 'My string test'
    let strCrypted: string

    it('Encrypt', () => {
        strCrypted = crypt.encrypt(str)

        expect(strCrypted).toBeDefined()
        expect(strCrypted).not.toEqual(str)
    })

    it('Decrypt', () => {
        strCrypted = crypt.decrypt(strCrypted)

        expect(strCrypted).toBeDefined()
        expect(strCrypted).toStrictEqual(str)
    })
})