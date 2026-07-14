import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

// Point d'entrée de l'application Vue :
// on crée l'app, on branche le routeur, puis on l'attache à #app dans index.html.
createApp(App).use(router).mount('#app');
