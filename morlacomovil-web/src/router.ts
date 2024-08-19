import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
//   import AuthService from "./services/auth-service";

//   const authService = new AuthService();

const Home = () => import('./views/HomeView.vue')
// const Login = () => import('./views/Login.vue')
const Shell = () => import('./views/Shell.vue')
const Login = () => import('./views/Login.vue')
// const Denied = () => import('./views/Denied.vue')
// const ChangeUserPassword = () => import('./views/ChangeUserPassword.vue')
// const AddBankFile = () => import('./views/AddBankFile.vue')
// const AddMarketFile = () => import('./views/AddMarketFile.vue')

const routes = [
  {
    path: '/',
    name: 'shell',
    component: Shell,
    redirect: '/home',
    children: [
      { path: '/home', name: 'home', component: Home }
      //   { path: '/addBankFile', name: 'addBankFile', component: AddBankFile },
      //   { path: '/addMarketFile', name: 'addMarketFile', component: AddMarketFile },
      //   { path: '/denied', name: 'denied', component: Denied },
      //   {
      //     path: '/changePassword',
      //     name: 'changePassword',
      //     component: ChangeUserPassword
      //   }
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

// router.beforeEach((to: RouteLocationNormalized) => {
// //   const token = authService.getToken()
//   const isAuthenticated = localStorage.getItem('auth_token')

//   if (to.name == 'login' && token) {
//     return { name: 'shell' }
//   }

//   if (to.name != 'login' && !token) {
//     return { name: 'login' }
//   }
// })

export default router
