// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios';
Vue.prototype.$axios = axios;
import './assets/font/iconfont'
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  loading: ''
})

Vue.config.productionTip = false;

/* eslint-disable no-new */
export let vue =  new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
