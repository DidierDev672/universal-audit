import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createNotivue }  from 'notivue'
import './style.css'
import App from './App.vue'
import { router } from './routes/index';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'notivue/notifications.css'
import 'notivue/animations.css'

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(createNotivue({ position: 'top-right' }))
app.use(router);
app.mount('#app');
// createApp(App).mount('#app')
