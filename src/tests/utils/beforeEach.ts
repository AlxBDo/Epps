import { beforeEach } from "vitest"
import { createPinia, setActivePinia } from "pinia"

import { createPluginMock } from "../../testing/mocks/epps"
import { App, createApp } from "vue"


export function beforeEachPiniaPlugin() {

    beforeEach(() => {
        const app = createApp({})

        const pinia = createPinia().use(
            createPluginMock('localStorage', 'CryptK€Y-EPpS_t35t!n9&%?qa31z', 'Cryptk€Y-EPpS_t35t!n9')
        )
        app.use(pinia)
        setActivePinia(pinia)
    })
}