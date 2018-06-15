import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import PhotoBrowser from './components/PhotoBrowser'
import BootstrapVue from 'bootstrap-vue'
import * as  nasaMarsApiWrapper from "./utils/nasaMarsApiWrapper";
document.x =  nasaMarsApiWrapper;
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(BootstrapVue);
// Vue.$http.headers.common['Access-Control-Allow-Origin
// '] = true;
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
