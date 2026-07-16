// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './firebase' // ensures firebase is initialized (src/firebase/index.js)

createApp(App)
  .use(router)
  .mount('#app')
