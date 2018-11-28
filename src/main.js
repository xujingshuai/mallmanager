// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'
import MyBread from '@/components/cuscom/myBread.vue'

Vue.use(ElementUI);
Vue.use(MyHttpServer);

// 定义处理日期格式的过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD');
})

// 定义全局组件
Vue.component(MyBread.name,MyBread);

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
