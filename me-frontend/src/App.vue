<template>
  <div id="viewPort">
    <div id="app" >
      <app-template></app-template>
    </div>
  </div>
</template>

<script>
  import AppTemplate from "./components/template/AppTemplate";
  export default {
    name: 'app',
    components: {AppTemplate},
  }
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import 'styles/global';
</style>
