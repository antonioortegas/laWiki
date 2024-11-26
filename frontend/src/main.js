import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue'
//import App from './App.vue'
import App from './components/TestShowRating.vue'
import App2 from './components/TestNotification.vue'
//import App from './components/StarRating.vue'

createApp(App).mount('#app')
createApp(App2).mount('#app2')