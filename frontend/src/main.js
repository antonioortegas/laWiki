import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue'
//import App from './App.vue'
import App from './App.vue'
import router from './router'
import Rating from './components/TestShowRating.vue'
import Campana from './components/TestNotification.vue'
//import App from './components/StarRating.vue'

createApp(Rating).mount('#app')
createApp(Campana).mount('#app2')
createApp(App).use(router).mount('#app')
