<template>
  <div id="app-template">
    <nav-bar :rovers="rovers"></nav-bar>
    <photo-browser></photo-browser>
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
        this.$root.authenticated = true;
        this.$root.userName = response.name;
        this.$root.userId = response.id;
        },
        error => {
          this.$root.authenticated = false;
          this.$root.userName = '';
          this.$root.userId = '';
        }
      );
    },
    methods: {
    },
    components: {
      'photo-browser': PhotoBrowser,
      'nav-bar': NavBar,
    }
  }
</script>

<style>

</style>
