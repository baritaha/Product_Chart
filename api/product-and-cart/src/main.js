import { createApp } from 'vue';
import App from './App.vue';
import store from './index'; // Import your Vuex store instance
import router from './router'; // Import your Vue Router instance
import './assets/styles/style.scss';

const app = createApp(App);
const storedUserId = localStorage.getItem('userId');
const storedUsername = localStorage.getItem('username');
if (storedUserId && storedUsername) {
  store.commit('setUser', { username: storedUsername, userId: storedUserId });
}
app.use(store); // Use the Vuex store
app.use(router); // Use the Vue Router

app.mount('#app');
