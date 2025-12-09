import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './stores/auth';
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.css';

axios.defaults.baseURL = 'https://cestificacoesiso-back.onrender.com/';
axios.defaults.withCredentials = true; 

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(router);
app.use(pinia);


app.mixin({
  setup() {
    const authStore = useAuthStore();

    axios.interceptors.request.use(
      (config) => {
        const token = authStore.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    authStore.initializeStore();
  },
});

app.mount('#app');
