import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'

const Home = () => import('./views/HomeView.vue')
const Shell = () => import('./views/Shell.vue')
const Login = () => import('./views/Login.vue')


const routes = [
  {
    path: '/',
    name: 'shell',
    component: Shell,
    redirect: '/home',
    children: [
      { path: '/home', name: 'home', component: Home }
    ]
  },
  { path: '/login', name: 'login', component: Login },
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return Promise.resolve({ left: 0, top: 0 })
  }
})

router.beforeEach((to: RouteLocationNormalized) => {
  const isAuthenticated  = !!localStorage.getItem("user_data");

  if (to.name == 'login' && isAuthenticated) {
    return { name: 'shell' }
  }

  if (to.name != 'login' && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
