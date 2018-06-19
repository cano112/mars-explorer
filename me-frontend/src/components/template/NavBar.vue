<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Mars Explorer</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item-dropdown v-for="roverName in rovers"
                             :key="roverName">
          <template slot="button-content">
            <span>{{roverName}}</span>
          </template>
          <b-dropdown-item v-for="camera in cameras[roverName.toLowerCase()]"
                           :key="camera"
                           :to="`/browser/${roverName.toLowerCase()}/${camera.toLowerCase()}/0`">
            {{camera.toUpperCase()}}
          </b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <span>User</span>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import {CAMERAS} from "../../model/Rover";

  export default {
    name: 'nav-bar',
    props: ['rovers'],
    data() {
      return {
        cameras: CAMERAS
      }
    },
    methods: {
      updateCurrentRover: function (currentRover) {
        this.$emit('rover-changed', currentRover);
      }
    }
  }
</script>

<style>

</style>
