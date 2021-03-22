import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/Login.vue'
import Home from 'components/home/Home.vue'
import Welcome from 'components/home/childComps/Welcome.vue'
import Users from 'components/home/childComps/Users.vue'
import Roles from 'components/power/Roles.vue'
import Rights from 'components/power/Rights.vue'
import Cate from 'components/goods/Cate.vue'
import Params from 'components/goods/Params.vue'
import GoodsList from 'components/goods/List.vue'
import Add from 'components/goods/Add.vue'
import Order from 'components/order/Order.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/Rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  return next()
})
export default router
