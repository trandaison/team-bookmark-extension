import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import createApiClient from './clients/api';
import createHttpClient from './clients/http';
import VueAxios from 'vue-axios';

import 'element-plus/dist/index.css';

import App from './Popup.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.use(VueAxios, { api: createApiClient(), http: createHttpClient() });

app.provide('api', app.config.globalProperties.api);
app.provide('http', app.config.globalProperties.http);

app.mount('#app');
