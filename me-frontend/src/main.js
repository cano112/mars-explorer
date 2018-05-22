import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import PhotoBrowser from './components/PhotoBrowser'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: PhotoBrowser }
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
}).$mount('#app')
