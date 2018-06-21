<template>
  <div id="saved-photos">
    <div class="container-fluid">
      <b-list-group>
        <b-list-group-item v-for="photo in photos" :key="photo.url" :to="photo.url">
          <span>Rover</span>:
          <span class="text-capitalize font-weight-bold">{{photo.rover}}</span><br />
          <span>Camera</span>:
          <span class="text-capitalize font-weight-bold">{{photo.cameraType}}</span><br />
          <span>Sol</span>:
          <span class="text-capitalize font-weight-bold">{{photo.sol}}</span>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
  import {PhotoService} from "../../service/PhotoService";

  export default {
    name: 'saved-photos',
    props: [],
    data() {
      return {
        photos: [
          {url:  '/browser/curiosity/rhaz/15/1/3', rover: 'CURIOSITY', sol: '4', cameraType: 'FHAZ'},
          {url:  '/browser/curiosity/rhaz/15/1/5', rover: 'CURIOSITY', sol: '4', cameraType: 'FHAZ'},
          {url:  '/browser/curiosity/rhaz/15/1/1', rover: 'CURIOSITY', sol: '4', cameraType: 'FHAZ'},
        ],
      }
    },
    created() {
      if(!this.$root.authenticated) {
        this.$router.replace('/error');
      } else {
        PhotoService.getUserPhotos(
          response => {
            this.$data.photos = response.data;
          },
          error => {
            console.log("error");
          }
        )
      }
    },
    mounted() {

    },
    methods: {
    }
  }
</script>

<style>

</style>
