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
                           :to="`/browser/${roverName.toLowerCase()}/${camera.toLowerCase()}/0/1/0`">
            {{camera.toUpperCase()}}
          </b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item right :href="loginUrl" v-if="!this.$root.authenticated">Login</b-nav-item>
        <b-nav-item-dropdown right v-if="this.$root.authenticated">
          <!-- Using button-content slot -->
          <template slot="button-content">
            {{this.$root.userName}}
          </template>
          <b-dropdown-item to="/saved">Saved photos</b-dropdown-item>
          <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import {CAMERAS} from "../../model/Rover";
  import {LOGIN_URL} from "../../config/ApiConfig";
  import {UserService} from "../../service/UserService";

  export default {
    name: 'nav-bar',
    props: ['rovers'],
    data() {
      return {
        cameras: CAMERAS,
        loginUrl: LOGIN_URL,
      }
    },
    methods: {
      logout() {
        UserService.logout(() => {
          this.$root.authenticated = false;
          this.$root.userName = '';
          this.$root.userId = '';
        })
      },
    }
  }
</script>

<style>

</style>
