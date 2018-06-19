<template>
  <div id="photo-browser">
    <b-tabs pills card>
      <b-tab  title-item-class="danger" :title="`${rover.getName}`" v-for="rover in rovers" :key="rover.getId">
        <div>
          <rover-template :roverName="`${rover.getName}`"></rover-template>
        </div>
        <rover-manifest :rover="`${rover}`" :infos-visible="`${infosVisible}`"></rover-manifest>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
  import RoverTemplate from './RoverTemplate.vue';
  import RoverManifest from './RoverManifest.vue';

  export default {
    name: 'photo-browser',
    created() {
      NasaMarsApiWrapper.getRovers(this.$data);
    },
    data() {
      return {
        rovers: [],
        infosVisible: false,
      }
    },
    methods: {

    },
    components: {
      'rover-template': RoverTemplate,
      'rover-manifest': RoverManifest
    },
  }
</script>

<style>

</style>
