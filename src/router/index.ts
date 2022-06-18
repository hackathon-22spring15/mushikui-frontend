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
    path: '/random/:seeds',
    name: 'Random',
    component: Random,
    props: true
  },
  {
    path: '/random',
    redirect: '/random/' +  Math.floor(Math.random() * 100000),
    name: 'Redirect',
    component: Random,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
