// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Button, Field, Actionsheet, Picker, Popup, NavBar, Row, Col, Icon, Tabbar, TabbarItem, Uploader } from 'vant'

Vue.use(Button)
Vue.use(Field)
Vue.use(Actionsheet)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(NavBar)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Row).use(Col)
Vue.use(Icon)
Vue.use(Uploader)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
