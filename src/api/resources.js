import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// HTTP相关
Vue.http.options.crossOrigin = true
Vue.http.options.credentials = true

const API_ROOT = process.env.NODE_ENV === 'production' ? 'https://api.jackhu.top/api/' : 'http://localhost:8080/api/'

// Vue.http.interceptors.push((request, next) => {
//   // 这里对请求体进行处理
//   request.headers = request.headers || {}
//   if (isLogin()) {
//     request.headers.set('Authorization', 'Bearer ' + getCookie('token').replace(/(^\")|(\"$)/g, ''))
//   }
//   next((response) => {
//     // 这里可以对响应的结果进行处理
//     if (response.status === 401) {
//       signOut()
//       window.location.pathname = '/login'
//     }
//   })
// })

export const AuthResource = Vue.resource(API_ROOT + 'CarOwner{/id}')
