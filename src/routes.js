import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Learn from './pages/Learn.vue'
import Build from './pages/Build.vue'
import BlueprintDetail from './pages/BlueprintDetail.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/learn',
    name: 'learn',
    component: Learn
  },
  {
    path: '/build',
    name: 'build',
    component: Build
  },
  {
    path: '/build/blueprints/:slug',
    name: 'blueprint-detail',
    component: BlueprintDetail,
    props: true
  },
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory('/agentic-ai-garden/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
