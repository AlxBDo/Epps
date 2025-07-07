import { describe, expect, it } from 'vitest'

import Crypt from "../services/Crypt";

describe('connectedUserStore extends userStore, contactStore and itemStore', () => {
    const crypt = new Crypt('HrN2t2nCr6pTiV22')
    const str = 'My string test'
    let strCrypted: string

    it('Encrypt', async () => {
        strCrypted = await crypt.encrypt(str)

        expect(strCrypted).toBeDefined()
        expect(strCrypted).not.toEqual(str)
    })

    it('Decrypt', async () => {
        strCrypted = await crypt.decrypt(strCrypted)

        expect(strCrypted).toBeDefined()
        expect(strCrypted).toStrictEqual(str)
    })
})