import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookie from 'vue3-cookies';

const app = createApp(App)
app.use(router)
app.use(VueCookie)
app.mount('#app')
