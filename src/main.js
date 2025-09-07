import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPlugin } from './plugins/createPlugin'

const dbNameIndexedDB = 'storePersister'
const dbNameLocalStorage = 'localStorage'

const pinia = createPinia()
pinia.use(
    createPlugin(dbNameLocalStorage, import.meta.env.VITE_CRYPT_IV)
)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
