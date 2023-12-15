import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsPage from '../views/ProductsPage.vue'
import PastOrders from '../views/PastOrders.vue'
import LgoinPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
 import App from '../App.vue'
const routes = [
  {
    path: '/HomeView',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/HomeView',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/ProductsPage',
    name: 'ProductsPage',
    component: ProductsPage
  },
  {
    path: '/PastOrders',
    name: 'PastOrders',
    component: PastOrders
  },
  {
    path: '/LoginPage',
    name: 'LoginPage',
    component: LgoinPage
  },
  {
    path: '/RegisterPage',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/App',
    name: 'App',
    component: App
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
