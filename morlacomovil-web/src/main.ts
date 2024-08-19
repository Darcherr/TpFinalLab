import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'

import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

declare global {
  interface Window {
    GLOBAL_CONFIG: {
      API_URL: string
    }
  }
}

fetch('/config.json')
  .then((result) => result.json())
  .then((config) => {
    console.log('che', config)
    window.GLOBAL_CONFIG = config
    buildApp();
  })


const buildApp = () => {
  createApp(App)
    .use(router)
    .use(PrimeVue)
    .mount("#app");
};

