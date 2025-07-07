import { beforeEach } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { createPluginMock } from "../../testing/mocks/epps"
import { createApp } from "vue"


export function beforeEachPiniaPlugin() {

    beforeEach(() => {
        const app = createApp({})

        const pinia = createPinia().use(
            createPluginMock('localStorage', 'HrN2t2nCr6pTkEy20221l2B3dOcPr4j2')
        )

        app.use(pinia)
        setActivePinia(pinia)
    })
}