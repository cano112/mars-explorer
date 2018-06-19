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

  export default {
    name: 'app-template',
    props: ['currentRover', 'camera', 'sol'],
    data() {
      return {
        rovers: ROVERS,
      }
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
