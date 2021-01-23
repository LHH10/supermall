import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import()

//1.安装插件
Vue.use(VueRouter)

//2.创建router
const routes = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/category',
    name: 'Category',
    component: Category
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/cart',
    name: 'Cart',
    component: ShopCart
  }
]
const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
