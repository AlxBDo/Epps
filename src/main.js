import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPlugin } from './plugins/epps'

const pinia = createPinia()

const dbNameIndexedDB = 'storePersister'
const dbNameLocalStorage = 'localStorage'

const eppsPlugin = createPlugin(
    dbNameLocalStorage, 
    import.meta.env.VITE_CRYPT_IV, 
    import.meta.env.VITE_CRYPT_KEY
)

pinia.use(eppsPlugin)
const app = createApp(App)

app.use(pinia)

app.mount('#app')
