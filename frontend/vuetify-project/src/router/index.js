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
import Game from '@/components/GameView.vue'

const routes = [
  {
    path: '/',
    name: 'gameview',
    component: Game,
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
  },
  {
    path: '/gameview',
    component: Game,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/gameview'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Si requiere autenticación y no hay token → redirige al login
  if (authRequired && !token) {
    return next('/login');
  }

  // Si intenta acceder al dashboard y no es admin → redirige al login con alerta
  if (to.path === '/dashboard' && (!user || user.role !== 'admin')) {
    alert('Acceso denegado: solo administradores');
    return next('/login');
  }



  next(); // Todo ok, continuar
});



export default router
