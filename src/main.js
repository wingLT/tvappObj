// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*
* 必用框架引入*/
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import nice from 'nicescroll'
import eChart from  'echarts'

/*字体 */
import '../static/lib/fonts/7-stroke/7-stroke.css'
import "../static/lib/fonts/web-icons/web-icons.css"
import "../static/lib/fonts/themify/themify.css"
import "../static/lib/fonts/glyphicons/glyphicons.css"
import "../static/lib/fonts/font-awesome/font-awesome.css"
import "../static/lib/fonts/ionicons/ionicons.css"
import "../static/lib/fonts/material-design/material-design.css"
import "../static/lib/fonts/mfglabs/mfglabs.css"
import "../static/lib/fonts/octicons/octicons.css"
import "../static/lib/fonts/open-iconic/open-iconic.css"
import "../static/lib/fonts/weather-icons/weather-icons.min.css"


/*css*/
import '../static/css/comm.css'
import "../static/css/bootstrap.css"
import '../static/laydate/theme/default/laydate.css'
import '../static/css/swiper-3.4.2.min.css'


/*js*/
import '../static/js/bootstrap'
import "../static/js/yfslPageControl"
import '../static/laydate/laydate'
// import '../static/lib/js/yfslBootstrap'


import '../static/css/common.css'
Vue.config.productionTip = false;
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
