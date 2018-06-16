<template>
  <div id="photo-browser"  >
    <b-tabs pills card >
      <b-tab  :title="`${rover.getName}`" v-for="rover in rovers" :key="rover.getId" >
          <b-card :title="`${rover.getName}`" bg-variant="light" >
            <div>
              <rover-template :roverName="`${rover.getName}`"><!--<h2>Image Slider Place Holder</h2>--></rover-template>
            </div>
            <b-list-group>
              <b-list-group-item> Landing date: <span class="font-weight-bold">{{rover.getLandingDate}}</span></b-list-group-item>
              <b-list-group-item> Launch date: <span class="font-weight-bold">{{rover.getLaunchDate }}</span>  </b-list-group-item>
              <b-list-group-item> Status: <span class="font-weight-bold">{{rover.getStatus}}</span></b-list-group-item>
              <b-list-group-item> Max sola: <span class="font-weight-bold">{{rover.getMaxSol}}</span> </b-list-group-item>
              <b-list-group-item> Max date: <span class="font-weight-bold">{{rover.getMaxDate}}</span> </b-list-group-item>
              <b-list-group-item> Photos: <span class="font-weight-bold">{{rover.getTotalPhotos}}</span> </b-list-group-item>
              <b-list-group-item>
                <h4>Cameras</h4>
                <b-list-group>
                  <b-list-group-item v-for="camera in rover.getCameras" :key="camera.getName" class="small">
                    Camera code: {{camera.name}} <br/> Full name: <span class="font-weight-bold">{{camera.getFullName}}</span>
                  </b-list-group-item>
                </b-list-group>
              </b-list-group-item>
            </b-list-group>
          </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>

  import { PhotoManifest,Statics, Camera, NasaMarsApiWrapper }  from "../utils/nasaMarsApiWrapper"
  import RoverTemplate from './RoverTemplate.vue';

  //TODO add component rover-template


  export default {
    name: 'photo-browser',
    created(){
      console.log("hello init");
      console.log(this.$data);
      NasaMarsApiWrapper.getRovers(this.$data);
      console.log("end init");
    },
    data(){
      return{
        rovers:[]
      }
    },
    methods: {
      refresh(){}
    },
    components:{
      'rover-template': RoverTemplate
    },
  }



</script>

<style>

</style>
