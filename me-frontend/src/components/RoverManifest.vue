<template>
  <b-card footer-tag="footer" no-body class="fixed-bottom mb-1" v-b-toggle.collapse2
          style="z-index: 1000; max-height: 300px">
    <b-collapse id="collapse2" v-model="infosVisible" style="overflow-y:scroll">
      <b-card-body>
        <b-container class="bv-example-row">
          <b-row>
            <b-col>
              <b-list-group>
                <h4>Mission</h4>
                <b-list-group-item>
                  <span>Landing date:</span>
                  <span class="font-weight-bold">{{roverObj.getLandingDate}}</span>
                </b-list-group-item>
                <b-list-group-item>
                  <span>Launch date:</span>
                  <span class="font-weight-bold">{{roverObj.getLaunchDate}}</span>
                </b-list-group-item>
                <b-list-group-item>
                  <span>Status:</span>
                  <span  class="font-weight-bold text-primary"  :class="{'text-danger': rover.getStatus !== 'active' }" >
                    {{rover.getStatus}}
                  </span>
                </b-list-group-item>
                <b-list-group-item>
                  <span>Max sol:</span>
                  <span class="font-weight-bold">{{roverObj.getMaxSol}}</span>
                </b-list-group-item>
                <b-list-group-item>
                  <span>Max date:</span>
                  <span class="font-weight-bold">{{roverObj.getMaxDate}}</span>
                </b-list-group-item>
                <b-list-group-item>
                  <span>Photos count:</span>
                  <span class="font-weight-bold">{{roverObj.getTotalPhotos}}</span>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col>
              <h4>Cameras</h4>
              <b-list-group>
                <b-list-group-item v-for="camera in roverObj.getCameras" :key="camera.getName" class="small">
                  <span>Camera code: {{camera.name}}</span>
                  <br/>
                  <span>Full name:</span>
                  <span class="font-weight-bold">{{camera.getFullName}}</span>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </b-container>
      </b-card-body>
    </b-collapse>
    <b-card-footer v-if="!infosVisible" header-tag="header" class="p-1 text-center align-content-center"
                   role="tab">
      <span>Details</span>
    </b-card-footer>
  </b-card>
</template>
<script>

  import {Rover} from "../utils/nasaMarsApiWrapper";

  export default {
    name: "rover-manifest",
    props: ['rover', 'infosVisible'],
    data() {
      return {
        roverObj: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.roverObj = this.$props.rover;
      }
    }

    watch: {
      roverObj() {

      }
    }
  }
</script>
