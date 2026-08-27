import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style.css'
import App from './App.vue'

// Pages
import Homepage from './pages/Homepage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import WorkoutsPage from './pages/WorkoutsPage.vue';
import Logout from './components/Logout.vue';

import ErrorPage from './pages/ErrorPage.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Homepage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage
    },
    {
      path: '/myworkouts',
      name: 'Workouts',
      component: WorkoutsPage
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
    path: '/:catchAll(.*)',
    component: ErrorPage
    } 
  ]
});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')