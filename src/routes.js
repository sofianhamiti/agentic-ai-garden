import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Learn from './pages/Learn.vue'
import Build from './pages/Build.vue'
import TemplateDetail from './pages/TemplateDetail.vue'
import UseCaseDetail from './pages/UseCaseDetail.vue'
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
    path: '/build/templates/:slug',
    name: 'template-detail',
    component: TemplateDetail,
    props: true
  },
  {
    path: '/build/use-cases/:slug',
    name: 'usecase-detail',
    component: UseCaseDetail,
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
