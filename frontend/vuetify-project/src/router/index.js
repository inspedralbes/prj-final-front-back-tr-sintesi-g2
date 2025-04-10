/**
 * router/index.ts
 *
 * Manual routes with login redirection and route protection
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/login.vue'
import RegisterComponent from '@/components/register.vue'
import Dashboard from '@/components/Dashboard.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      return localStorage.getItem('token') ? '/dashboard' : '/login'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterComponent
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }

  next();
});

export default router
