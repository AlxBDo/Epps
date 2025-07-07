import { describe, expect, it } from 'vitest'

import Crypt from "../services/Crypt";
import { Epps } from "../plugins/epps";
import PersisterMock from '../testing/mocks/persister'

describe('Epps class', () => {
    const crypt = new Crypt('HrN2t2nCr6pTiV22')
    const persister = new PersisterMock({ name: 'localStorage' })
    const epps = new Epps(persister, crypt)

    it('Epps get Crypt', () => {
        expect(epps.crypt).toBeInstanceOf(Crypt)
    })

    it('Epps get Persister', () => {
        expect(epps.db).toBeInstanceOf(PersisterMock)
    })
})