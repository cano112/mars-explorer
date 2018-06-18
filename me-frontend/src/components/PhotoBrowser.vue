<template>
  <div id="photo-browser">
    <b-tabs pills card>
      <b-tab  title-item-class="danger" :title="`${rover.getName}`" v-for="rover in rovers" :key="rover.getId">
        <div>
          <rover-template :roverName="`${rover.getName}`"></rover-template>
        </div>

        <b-card footer-tag="footer" no-body class="fixed-bottom mb-1" v-b-toggle.collapse2
                style="z-index: 1000; max-height: 300px">
          <b-collapse id="collapse2" v-model="infosVisible" style="overflow-y:scroll">
            <b-card-body>
              <b-container class="bv-example-row">
                <b-row>
                  <b-col>
                    <b-list-group>
                      <h4>Mission</h4>
                      <b-list-group-item> Landing date: <span class="font-weight-bold">{{rover.getLandingDate}}</span>
                      </b-list-group-item>
                      <b-list-group-item> Launch date: <span class="font-weight-bold">{{rover.getLaunchDate }}</span>
                      </b-list-group-item>
                      <b-list-group-item> Status:
                        <span  class="font-weight-bold text-primary"  :class="{'text-danger': rover.getStatus !== 'active' }" >{{rover.getStatus}}</span>
                      </b-list-group-item>
                      <b-list-group-item> Max sola: <span class="font-weight-bold">{{rover.getMaxSol}}</span>
                      </b-list-group-item>
                      <b-list-group-item> Max date: <span class="font-weight-bold">{{rover.getMaxDate}}</span>
                      </b-list-group-item>
                      <b-list-group-item> Photos: <span class="font-weight-bold">{{rover.getTotalPhotos}}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                  <b-col>


                    <h4>Cameras</h4>
                    <b-list-group>
                      <b-list-group-item v-for="camera in rover.getCameras" :key="camera.getName" class="small">
                        Camera code: {{camera.name}} <br/> Full name: <span
                        class="font-weight-bold">{{camera.getFullName}}</span>
                      </b-list-group-item>
                    </b-list-group>


                  </b-col>
                </b-row>

              </b-container>

            </b-card-body>
          </b-collapse>
          <b-card-footer v-if="!infosVisible" header-tag="header" class="p-1 text-center align-content-center"
                         role="tab">
            <span> Details</span>
          </b-card-footer>
        </b-card>

      </b-tab>
    </b-tabs>
  </div>
</template>

<script>

  import {PhotoManifest, Statics, Camera, NasaMarsApiWrapper} from "../utils/nasaMarsApiWrapper"
  import RoverTemplate from './RoverTemplate.vue';

  //TODO add component rover-template


  export default {
    name: 'photo-browser',
    created() {
      console.log("hello init");
      NasaMarsApiWrapper.getRovers(this.$data);
    },
    data() {
      return {
        rovers: [],
        infosVisible: false,
      }
    },
    methods: {
      toggleInfos() {
        infosVisible = !infosVisible;
      },
      refresh() {
      },
      showInfos() {
        console.log("test")
        this.$data.infosVisible = true;
      },
      hideInfos() {
        console.log("test2")
        this.$data.infosVisible = false;
      }
    },
    components: {
      'rover-template': RoverTemplate
    },
  }


</script>

<style>

</style>
