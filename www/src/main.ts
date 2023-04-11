import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locales'

import "@/styles/index.scss";

const app = createApp(App)


app.use(createPinia()).use(router).use(i18n)

// app.use(ElementPlus)

app.mount('#app')
