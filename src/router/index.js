import Vue from "vue"
import Router from "vue-router"
import Login from "@/components/login/login.vue"
import Home from "@/components/home/home.vue"
import Users from "@/components/users/users.vue"
import Right from "@/components/rights/right.vue"
import Role from "@/components/rights/role.vue"
import {Message} from 'element-ui'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: {
        name: "login"
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          name: "users",
          path: "/users",
          component: Users
        },
        {
          name: "rights",
          path: "/rights",
          component: Right
        },
        {
          name: "roles",
          path: "/roles",
          component: Role
        }
      ]
    }
  ]
});


// 在路由配置生效之前  统计判断token
// 路由守卫 在路由配置生效之初有
// 路由/导航 守卫
router.beforeEach((to, from, next) => {
  // 如果要去的是登录 直接next
  if(to.path === '/login') {
    next();
  } else {
    // 如果要去的不是登录
    // 判断token
    const token = localStorage.getItem('token');
    if(!token) {
      // 如果没有token --> login
      // 提示请先登录
      Message.warning('请先登录');
      router.push({name:'login'})
      return
    }

    next()
  }

})

export default router
