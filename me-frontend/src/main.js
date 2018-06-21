import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import PhotoBrowser from './components/photo_browser/PhotoBrowser'
import SavedPhotos from './components/saved_photos/SavedPhotos'
import BootstrapVue from 'bootstrap-vue'
import {ROVERS, CAMERAS} from "./model/Rover";
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import {UserService} from './service/UserService';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.component('icon', Icon);

const routes = [
  { path: '/', redirect: '/browser/' + ROVERS[0].toLowerCase() + '/' + CAMERAS[ROVERS[0].toLowerCase()][0] + '/0/1/0' },
  { path: '/browser/:currentRover/:camera/:sol/:page/:index', component: PhotoBrowser },
  { path: '/saved', component: SavedPhotos }
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
      /**
       * Reactive getter for username stored in a non-reacive local storage.
       * @returns {string} username
       */
      get userName() {
        return UserService.getUserName();
      },

      /**
       * Reactive setter for username stored in a non-reacive local storage.
       * @param name username
       */
      set userName(name) {
        UserService.setUserName(name);
      },

      /**
       * Reactive getter for authenticated flag stored in a non-reacive local storage.
       * @returns {boolean} authenticated flag
       */
      get authenticated() {
        return UserService.isAuthenticated();
      },

      /**
       * Reactive setter for authenticated flag stored in a non-reacive local storage.
       * @param value authenticated flag
       */
      set authenticated(value) {
        UserService.setAuthenticated(value);
      },

      /**
       * Reactive getter for app's user identifier stored in a non-reacive local storage.
       * @returns {string} id
       */
      get userId() {
        return UserService.getUserId();
      },

      /**
       * Reactive setter for app's user identifier stored in a non-reacive local storage.
       * @param id user id
       */
      set userId(id) {
        UserService.setUserId(id);
      }
    }
  },
  router
}).$mount('#app');
