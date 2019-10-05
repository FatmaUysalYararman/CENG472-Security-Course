import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axiosLib from 'axios'
import hashLib from 'jshashes'


export const hashScript = hashLib
export const axios = axiosLib

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
