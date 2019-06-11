import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Photo from '@/components/Photo'
import Register from '@/components/Register'
import Member from '@/components/Member'
import MemberItem from '@/components/MemberItem'
import RepairOrder from '@/components/RepairOrder'
import CreateCar from '@/components/CreateCar'
import MemberBalance from '@/components/MemberBalance'
import RepairHistory from '@/components/RepairHistory'
import RepairHistoryDetail from '@/components/RepairHistoryDetail'
import RepairCarStatistics from '@/components/RepairCarStatistics'
import RepairCarStatisticsDetail from '@/components/RepairCarStatisticsDetail'
import MemberScan from '@/components/MemberScan'

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
    }, {
      path: '/repairOrder',
      name: 'RepairOrder',
      component: RepairOrder,
      meta: {
        check: false,
        isKeepAlive: true
      }
    }, {
      path: '/createCar',
      name: 'CreateCar',
      component: CreateCar,
      meta: {
        check: false
      }
    }, {
      path: '/memberBalance',
      name: 'MemberBalance',
      component: MemberBalance,
      meta: {
        check: true
      }
    }, {
      path: '/repairHistory',
      name: 'RepairHistory',
      component: RepairHistory,
      meta: {
        check: true
      }
    }, {
      path: '/repairHistoryDetail',
      name: 'RepairHistoryDetail',
      component: RepairHistoryDetail,
      meta: {
        check: true
      }
    }, {
      path: '/repairCarStatistics',
      name: 'RepairCarStatistics',
      component: RepairCarStatistics,
      meta: {
        check: true
      }
    }, {
      path: '/repairCarStatisticsDetail',
      name: 'RepairCarStatisticsDetail',
      component: RepairCarStatisticsDetail,
      meta: {
        check: true
      }
    }, {
      path: '/memberScan',
      name: 'MemberScan',
      component: MemberScan,
      meta: {
        check: true
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
