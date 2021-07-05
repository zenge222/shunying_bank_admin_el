import Vue from 'vue'
import AmapVue from '@amap/amap-vue'
import AMap from 'vue-amap';
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css
import elementUtils from 'vue-element-utils'
 
Vue.use(elementUtils);

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

AmapVue.config.key = '3d338f48cc21e6d56f6b4e8c158f3d72'
//导出表格
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.use(AmapVue).use(AMap)
Vue.use(AMap);
AMap.initAMapApiLoader({
  // 高德key
  key: '3d338f48cc21e6d56f6b4e8c158f3d72',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4',
  uiVersion: '1.0'
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock/index')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale: enLang })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.prototype.$store = store;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

Vue.prototype.pushTo = function (path, parameter = {}) {
  router.push({
    name: path,
    params: parameter
  });
};
Vue.prototype.replaceTo = function (path, parameter = {}) {
  router.replace({
    name: path,
    params: parameter
  });
};

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
