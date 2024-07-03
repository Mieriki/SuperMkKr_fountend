import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import axios from "axios";
import ElementPlus from 'element-plus';

import 'element-plus/theme-chalk/dark/css-vars.css'

axios.defaults.baseURL = 'http://localhost:8080'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
