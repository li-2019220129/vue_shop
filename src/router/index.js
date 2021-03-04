import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/Login.vue'
import Home from 'components/home/Home.vue'
import Welcome from 'components/home/childComps/Welcome.vue'
import Users from 'components/home/childComps/Users.vue'
import Roles from 'components/home/childComps/Roles.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
{
  path:'/login',
  component:Login
},
{
  path:'/home',
  component:Home,
  redirect:'/welcome',
  children:[
    { 
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/users',
      component:Users
    },
    {
      path:'/roles',
      component:Roles
    }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
   if(to.path=='/login') return next();
   const tokenStr=window.sessionStorage.getItem('token');
   if(!tokenStr) return next('/login');
   return next();
})
export default router
