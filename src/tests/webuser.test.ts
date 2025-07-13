import { describe, expect, it } from 'vitest'
import { beforeEachPiniaPlugin } from './utils/beforeEach'
import { useWebUserStore } from '../stores/webuser'
import type { WebUserStore, WebUserState } from '../stores/webuser'
import { EppsStore } from '../types'

const webUser = {
    '@id': 'webuser/1',
    id: 1,
    username: 'ernesttest',
    password: 'my-p@ssw0rd_72941'
}

const newPassword = 'new-p@ssw0rd_72941'

describe('webUserStore extends resourceIdStore', () => {
    beforeEachPiniaPlugin()

    let webUserStore: EppsStore<WebUserStore, WebUserState> | undefined

    it('Has setData method and methods defined in actionsToExtends are extended', async () => {
        webUserStore = useWebUserStore() as EppsStore<WebUserStore, WebUserState>
        webUserStore.setData(webUser)

        expect(webUserStore.username).toStrictEqual(webUser.username)
        expect(webUserStore.password).toStrictEqual(webUser.password)
        expect(webUserStore.id).toStrictEqual(webUser.id)
        expect(webUserStore['@id']).toStrictEqual(webUser['@id'])
    })

    it('Update password', async () => {
        if (webUserStore) {
            webUserStore.updatePassword(newPassword, webUser.password)
            expect(webUserStore.password).toStrictEqual(newPassword)
        }
    })

    it('Has access to parent state property and modify it', async () => {
        if (webUserStore) {
            webUserStore.id = 2
            expect(webUserStore.id).toStrictEqual(2)
        }
    })
})