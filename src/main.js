import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false
import moment from 'moment'
Vue.prototype.$http = axios
//将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function(originVal) {
  // let data = new Date(originVal)
  // let y = data.getFullYear()
  // let m = (data.getMonth() + 1 + '').padStart(2, '0')
  // let d = (data.getDate() + '').padStart(2, '0')
  // let hh = (data.getHours() + '').padStart(2, '0')
  // let mm = (data.getMinutes() + '').padStart(2, '0')
  // let ss = (data.getSeconds() + '').padStart(2, '0')
  // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  let data = moment(originVal).format('YYYY-MM-DD HH:mm:ss')
  return data
})
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
