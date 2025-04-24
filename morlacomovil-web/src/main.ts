import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'
import "./style.css";


import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import { useUserStore } from './store/storeExample';
import User from './models/user-model';
import PriceService from './services/CriptoYa/priceService';

const app = createApp(App);
const store = createPinia();

app.use(store);

const userStore = useUserStore();
userStore.startAutoUpdate(new PriceService);



declare global {
  interface Window {
    GLOBAL_CONFIG: {
      API_URL: string,
      API_KEY: string
    }
    Users: User[]
  }
}

fetch("/config.json")
  .then((result) => result.json())
  .then((config) => {
    window.GLOBAL_CONFIG = config;
    buildApp();
  });


const buildApp = () => {
  app
    .use(router)
    .use(PrimeVue)
    .mount("#app");
};


