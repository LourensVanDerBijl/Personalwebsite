// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ViewPage from '../routePages/viewPage.vue'
import AdminPage from '../routePages/adminPage.vue'
import AdminLoginPage from '../routePages/adminLoginPage.vue'

const routes = [
  { path: '/', name: 'Home', component: ViewPage, meta: { title: 'Home' } },
  { path: '/admin', name: 'Admin', component: AdminPage, meta: { title: 'Admin' } },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginPage, meta: { title: 'Admin Login' } },
  { path: '/:pathMatch(.*)*', redirect: '/' } // unknown routes redirect to home
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} • PersonalWebsite`
  }
})

export default router
