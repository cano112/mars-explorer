<template>
  <div id="app-template">
    <nav-bar :rovers="rovers"></nav-bar>
    <div class="content">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  import NavBar from './NavBar';
  import PhotoBrowser from "../photo_browser/PhotoBrowser";
  import {ROVERS} from "../../model/Rover";
  import {UserService} from "../../service/UserService";

  export default {
    name: 'app-template',
    props: ['currentRover', 'camera', 'sol'],
    data() {
      return {
        rovers: ROVERS,
      }
    },
    created() {
      UserService.getUserData(
        response => {
          if(response.name !== 'guest') {
            this.setAuthenticated(response);
          } else {
            this.setUnauthenticated();
          }
        },
        error => {
          this.setUnauthenticated();
        }
      );
    },
    methods: {
      setAuthenticated(response) {
        this.$root.authenticated = true;
        this.$root.userName = response.name;
        this.$root.userId = response.id;
      },

      setUnauthenticated() {
        this.$root.authenticated = false;
        this.$root.userName = '';
        this.$root.userId = '';
      }
    },
    components: {
      'photo-browser': PhotoBrowser,
      'nav-bar': NavBar,
    }
  }
</script>

<style>
  .content {
    margin: 5px;
  }
</style>
