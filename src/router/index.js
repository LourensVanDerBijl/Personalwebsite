// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ViewPage from '../routePages/viewPage.vue'
import AdminPage from '../routePages/adminPage.vue'
import { auth } from '../firebase' // ✅ import Firebase auth

const routes = [
  { path: '/', name: 'Home', component: ViewPage, meta: { title: 'Home' } },
  { path: '/admin', name: 'Admin', component: AdminPage, meta: { title: 'Admin' } },
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

// ✅ Protect /admin route
router.beforeEach((to, from, next) => {
  if (to.path === '/admin') {
    const user = auth.currentUser
    if (!user) {
      next('/') // redirect unauthenticated users back home
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} • PersonalWebsite`
  }
})

export default router
