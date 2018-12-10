import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Photo from '@/components/Photo'
import Register from '@/components/Register'
import Member from '@/components/Member'
import MemberItem from '@/components/MemberItem'

import { Toast } from 'vant'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        check: true
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        check: false
      }
    }, {
      path: '/photo',
      name: 'Photo',
      component: Photo,
      meta: {
        check: true
      }
    }, {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        check: false
      }
    }, {
      path: '/member',
      name: 'Member',
      component: Member,
      meta: {
        check: false
      }
    },
    {
      path: '/memberItem',
      name: 'MemberItem',
      component: MemberItem,
      meta: {
        check: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.check) {
    var check = async function () {
      const result = await sessionStorage.getItem('username')
      if (result && result.length > 0) {
        next()
      } else {
        Toast('用户未登录，请先登录！')
        next({path: '/login'})
      }
    }
    check()
  } else {
    next()
  }
})

export default router
