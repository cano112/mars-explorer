import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import AppTemplate from './components/template/AppTemplate'
import VueRx from 'vue-rx'
import BootstrapVue from 'bootstrap-vue'
import {ROVERS, CAMERAS} from "./model/Rover";
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueRx);
Vue.component('icon', Icon)

const routes = [
  { path: '/', redirect: '/browser/' + ROVERS[0].toLowerCase() + '/' + CAMERAS[ROVERS[0].toLowerCase()][0] + '/0' },
  { path: '/browser/:currentRover/:camera/:sol', component: AppTemplate}
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
}).$mount('#app');
