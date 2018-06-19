<template>
  <div id="viewPort">
    <div id="app" >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import 'styles/global';
</style>
