import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import AppTemplate from './components/template/AppTemplate'
import BootstrapVue from 'bootstrap-vue'
import {ROVERS, CAMERAS} from "./model/Rover";
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import {UserService} from './service/UserService';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.component('icon', Icon);

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
  data() {
    return {
      get userName() {
        return UserService.getUserName();
      },

      set userName(name) {
        UserService.setUserName(name);
      },

      get authenticated() {
        return UserService.isAuthenticated();
      },

      set authenticated(value) {
        UserService.setAuthenticated(value);
      },

      get userId() {
        return UserService.getUserId();
      },

      set userId(id) {
        UserService.setUserId(id);
      }
    }
  },
  router
}).$mount('#app');
