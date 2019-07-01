// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookies from 'vue-cookies'
import { Button, Field, Actionsheet, Picker, Popup, NavBar, Row, Col,
  Icon, Tabbar, TabbarItem, Uploader, Cell, CellGroup, Panel, Tab,
  Tabs, DatetimePicker, Search, List, Checkbox, CheckboxGroup, Area,
  Switch, SwitchCell, RadioGroup, Radio} from 'vant'

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
Vue.use(Cell).use(CellGroup)
Vue.use(Panel)
Vue.use(Tab).use(Tabs)
Vue.use(DatetimePicker)
Vue.use(Search)
Vue.use(List)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Area)
Vue.use(Switch)
Vue.use(SwitchCell)
Vue.use(RadioGroup)
Vue.use(Radio)

Vue.use(VueCookies)

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.prototype.$eventHub = new Vue() // Global event bus

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
