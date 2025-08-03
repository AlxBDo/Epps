import { describe, expect, it } from 'vitest'

import Crypt from "../services/Crypt";
import { EppsPlugin } from "../plugins/eppsPlugin";
import PersisterMock from '../testing/mocks/persister'

describe('EppsPlugin class', async () => {
    const crypt = new Crypt('HrN2t2nCr6pTiV22')
    await crypt.init()
    const persister = new PersisterMock({ name: 'localStorage' })
    const epps = new EppsPlugin(persister, crypt)

    it('Epps get Crypt', () => {
        expect(epps.crypt).toBeInstanceOf(Crypt)
    })

    it('Epps get Persister', () => {
        expect(epps.db).toBeInstanceOf(PersisterMock)
    })
})