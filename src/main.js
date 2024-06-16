import './assets/css/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyload from 'vue-lazyload';
import App from './App.vue'
import loadingImage from '@assets/images/avatar1.jpg'
import errorImage from '@assets/images/avatar1.jpg'

const app = createApp(App)

app.use(VueLazyload, {
  preLoad: 1.3,
  error: errorImage,
  loading: loadingImage,
  attempt: 1
});
app.use(createPinia())

app.mount('#app')
