import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
// import echarts from './assets/echarts';
// Vue.prototype.$echarts = echarts
// import * as G2 from '@antv/g2'  // 阿里可视化
// Vue.prototype.$G2 =G2

import { getRequest } from './utils/api';
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI)
ElementUI.Dialog.props.closeOnClickModal.default = false;
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
