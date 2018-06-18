<template>
  <div class="container" id="viewPort">
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
  /*@import 'styles/global';*/
  @import '../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  #viewPort {
    /*height: 100vh;*/
    /*width: 100vw;*/
    /*max-width: 100vw;*/
  }
  body {
    background-color: #070610;
    text: white;
    /*width: 100vw;*/
  }
</style>
