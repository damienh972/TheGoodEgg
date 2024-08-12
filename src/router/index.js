import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@pages/HomePage.vue'
import AnimusStats from '@/pages/AnimusStats.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/stats',
    name: 'Stats',
    component: AnimusStats,
    props: route => ({ data: route.params.data })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

