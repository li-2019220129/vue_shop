import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from 'components/Login.vue'
// import Home from 'components/home/Home.vue'
// import Welcome from 'components/home/childComps/Welcome.vue'
// import Users from 'components/home/childComps/Users.vue'
// import Roles from 'components/power/Roles.vue'
// import Rights from 'components/power/Rights.vue'
// import Cate from 'components/goods/Cate.vue'
// import Params from 'components/goods/Params.vue'
// import GoodsList from 'components/goods/List.vue'
// import Add from 'components/goods/Add.vue'
// import Order from 'components/order/Order.vue'
// import Report from 'components/report/Report.vue'
const Login = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/home/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "Login_Home_Welcome" */ 'components/home/childComps/Welcome.vue'
  )

const Users = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ 'components/home/childComps/Users.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ 'components/power/Rights.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ 'components/power/Roles.vue'
  )

const Cate = () =>
  import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Params.vue')

const GoodsList = () =>
  import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/List.vue')
const Add = () =>
  import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/Add.vue')

const Order = () =>
  import(/* webpackChunkName: "Order_Report" */ 'components/order/Order.vue')
const Report = () =>
  import(
    /* webpackChunkName: "Order_Report" */ 'components/report/Report.vue'
  )

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
      },
      {
        path: '/reports',
        component: Report
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
