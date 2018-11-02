import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        title: '会员中心'
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登陆'
      }
    }
  ]
})
