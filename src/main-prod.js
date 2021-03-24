import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
import axios from 'axios'
//导入 Nprogress包对应的JS和CSS
import Nprogress from 'nprogress'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

Vue.config.productionTip = false
// import moment from 'moment'
Vue.prototype.$http = axios
//将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function(originVal) {
  let data = new Date(originVal)
  let y = data.getFullYear()
  let m = (data.getMonth() + 1 + '').padStart(2, '0')
  let d = (data.getDate() + '').padStart(2, '0')
  let hh = (data.getHours() + '').padStart(2, '0')
  let mm = (data.getMinutes() + '').padStart(2, '0')
  let ss = (data.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  // let data = moment(originVal).format('YYYY-MM-DD HH:mm:ss')
  // return data
})
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中，展示进度条Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在response拦截器中，隐藏进度条Nprogress.done()
axios.interceptors.response.use(config=>{
  Nprogress.done()
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
