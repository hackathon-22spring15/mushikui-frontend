import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('../components/Home.vue')
const Random = () => import('../components/Random.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/random',
    name: 'Random',
    component: Random
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
