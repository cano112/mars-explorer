<template>
  <div id="photo-browser">
    <div class="container-fluid">
      <b-row>
        <b-col>
          <div class="d-flex flex-row justify-content-center">
            <b-button class="photo-switch-button text-dark" variant="link" size="lg" @click="prevPhoto">
              <icon name="chevron-left"></icon>
            </b-button>
            <div class="mars-image-container">
              <img v-if="photos[currentPhotoIndex] !== undefined"
                   v-bind:src="photos[currentPhotoIndex].imgSrc"
                   class="mars-image"
                   @load="loaded" />
              <div v-if="photos[currentPhotoIndex] === undefined" class="mars-image-placeholder bg-dark">
              </div>
              <div class="mars-image-layer" v-if="loading">
                <icon name="spinner" class="fa-pulse"></icon>
              </div>
            </div>
            <b-button class="photo-switch-button text-dark" variant="link" size="lg" @click="nextPhoto">
              <icon name="chevron-right"></icon>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-progress class="fixed-bottom" :value="currentPhotoIndex+1" :max="photos.length" variant="dark"></b-progress>
    <div class="photo-info-box">
      <span>Rover: <span class="text-capitalize font-weight-bold">{{this.$route.params['currentRover']}}</span></span>
      <br />
      <span>Sol: <span class="font-weight-bold">{{this.$route.params['sol']}}</span></span>
      <br />
      <span v-if="photos[currentPhotoIndex] !== undefined">Earth date: <span class="font-weight-bold">{{photos[currentPhotoIndex].earthDate}}</span></span>
      <br />
      <span v-if="photos[currentPhotoIndex] !== undefined">
        Camera:
        <span class="font-weight-bold">
          {{photos[currentPhotoIndex].camera._fullName}} ({{photos[currentPhotoIndex].camera._name}})
        </span>
      </span>
    </div>
    <div class="sol-buttons">
      <b-button class="sol-button" variant="secondary lg" @click="prevSol">
        <icon name="caret-left"></icon>
      </b-button>
      <b-button class="sol-button" variant="secondary lg" @click="nextSol">
        <icon name="caret-right"></icon>
      </b-button>
    </div>
  </div>
</template>

<script>
  import {PhotoService} from "../../service/PhotoService";
  import {RoverService} from "../../service/RoverService";

  export default {
    name: 'photo-browser',
    props: [],
    data() {
      return {
        'page': 1,
        'photos': [],
        'nextPagePhotos': [],
        'prevPagePhotos': [],
        'currentPhotoIndex': 0,
        'availableSols': [],
        'loading': true,
      }
    },
    created() {
      this.fetchManifest(this.fetchImages, this.noPhotoCallback);
    },
    mounted() {

    },
    methods: {

      /**
       * Fetch a single photos page.
       * Uses: $data.page, $route.params['currentRover'], $route.params['camera'], this.$route.params['sol'].
       * Photos are placed into $data.photos.
       */
      fetchImages() {
        this.$data.loading = true;
        this.fetchPhotosPage(this.$data.page,
        response => {
          console.log(response);
          this.$data.photos = PhotoService.parsePhotos(response);
          this.loading = false;
        },
        error => {
          console.log(error);
        });
      },

      /**
       * Make a single-page photos request.
       * @param page index of the page
       * @param onSuccess callback on successful request
       * @param onError callback on failed request
       */
      fetchPhotosPage(page, onSuccess, onError) {
        PhotoService.getRoverPhotos(
          this.$route.params['currentRover'],
          this.$route.params['camera'],
          this.$route.params['sol'],
          page,
          onSuccess,
          onError);
      },

      /**
       * Callback invoked when no photos for a given $route.params['sol'] and $route.params['camera'].
       * Redirects to the nearest sol.
       * @param sols sols with a given camera
       */
      noPhotoCallback(sols) {
        let nearestSol = this.getNearestSol(this.$route.params['sol'], sols);
        if(nearestSol === -1) {
          console.log("ERROR");
        } else {
          console.log(nearestSol);
          this.$router.replace({
            params: {
              sol: nearestSol
            }});
        }
      },

      /**
       * Fetch manifest for a given rover.
       * @param photoAvailableCallback callback when photo available for a given $route.params['currentRover'], this.$route.params['camera'], this.$route.params['sol']
       * @param photoNotAvailableCallback callback when photo available
       */
      fetchManifest(photoAvailableCallback, photoNotAvailableCallback) {
        this.$data.loading = true;
        RoverService.getRoverManifest(this.$route.params['currentRover'],
        response => {
          this.$data.manifest = response.data.photo_manifest;
          this.$data.availableSols = this.parseAvailableSols(this.$route.params['camera'], this.$data.manifest);
          if(this.$data.availableSols.indexOf(parseInt(this.$route.params['sol'])) !== -1) {
            photoAvailableCallback();
          } else {
            photoNotAvailableCallback(this.$data.availableSols);
          }

        },
        error => {
          console.log(error);
        });
      },

      /**
       * Listener on previous photo button. Moves to previous photo in a given sol - only if available.
       */
      prevPhoto() {
        if(this.$data.currentPhotoIndex > 0) {
          this.$data.loading = true;
          this.$data.currentPhotoIndex--;
          if(this.$data.currentPhotoIndex === 0 && this.$data.page !== 1 && this.$data.prevPagePhotos.length !== 0) {
            this.fetchPhotosPage(this.$data.page-1,
              response => {
                this.$data.prevPagePhotos = PhotoService.parsePhotos(response);
              },
              error => {
                console.log(error);
              });
          }
        } else {
          if(this.$data.prevPagePhotos.length !== 0) {
            this.$data.currentPhotoIndex = this.$data.prevPagePhotos.length-1;
            this.$data.nextPagePhotos = this.$data.photos;
            this.$data.photos = this.$data.prevPagePhotos;
            this.$data.prevPagePhotos = [];
            this.$data.page--;
          }
        }
      },

      /**
       * Listener on next photo button. Moves to next photo in a given sol - only if available.
       */
      nextPhoto() {
        if(this.$data.currentPhotoIndex >= this.$data.photos.length-1) {
          if(this.$data.nextPagePhotos.length !== 0) {
            this.$data.currentPhotoIndex = 0;
            this.$data.prevPagePhotos = this.$data.photos;
            this.$data.photos = this.$data.nextPagePhotos;
            this.$data.nextPagePhotos = [];
            this.$data.page++;
          }
        } else {
          this.$data.loading = true;
          this.$data.currentPhotoIndex++;
          if(this.$data.currentPhotoIndex === this.$data.photos.length-1) {
            this.fetchPhotosPage(this.$data.page+1,
              response => {
                if(response.data.photos.length !== 0) {
                  this.$data.nextPagePhotos = PhotoService.parsePhotos(response);
                }
              },
              error => {
                console.log(error);
              });
          }
        }
      },

      /**
       * Listener on previous sol button. Moves to previous sol from $data.availableSols - only if available.
       */
      prevSol() {
        let currentSolIndex = this.$data.availableSols.indexOf(parseInt(this.$route.params['sol']));
        if(currentSolIndex === -1) {
          let nearestSol = this.getNearestSol(this.$route.params['sol'], this.$data.availableSols);
          if(nearestSol === -1) {
            console.log("ERROR");
          } else {
            this.$router.push({
              params: {
                sol: nearestSol
              }});
          }
        }
        if(currentSolIndex > 0) {
          this.$router.push({
            params: {
              sol: this.$data.availableSols[currentSolIndex-1]
            }});
        }
      },

      /**
       * Listener on next sol button. Moves to next sol from $data.availableSols - only if available.
       */
      nextSol() {
        let currentSolIndex = this.$data.availableSols.indexOf(parseInt(this.$route.params['sol']));
        if(currentSolIndex === -1) {
          let nearestSol = this.getNearestSol(this.$route.params['sol'], this.$data.availableSols);
          if(nearestSol === -1) {
            console.log("ERROR");
          } else {
            this.$router.push({
              params: {
                sol: nearestSol
              }});
          }
        }
        if(currentSolIndex < this.$data.availableSols.length-1) {
          this.$router.push({
            params: {
              sol: this.$data.availableSols[currentSolIndex+1]
            }});
        }
      },

      /**
       * Retrieve sols available for a given camera
       * @param camera
       * @param manifest manifest to parse sols from
       * @returns {(*|string)[]} array with sol numers for a given camera
       */
      parseAvailableSols(camera, manifest) {
        return manifest.photos
          .filter(p => p.cameras.indexOf(camera.toUpperCase()) !== -1)
          .map(p => p.sol)
      },

        getNearestSol(sol, sols) {
        if(sols.length === 0) {
          return -1;
        }

        for(let i = 1; i < sols.length; i++) {
          if(sol < sols[i]) {
            return sols[i-1];
          }
        }
        return sols[sols.length-1];
      },

      loaded() {
        this.$data.loading = false;
      }
    },
    watch: {
      /**
       * Watch route change
       * @param to
       * @param from
       */
        $route(to, from) {
          this.$data.currentPhotoIndex = 0;
          this.$data.page = 1;
          this.$data.prevPagePhotos = [];
          this.$data.nextPagePhotos = [];
          this.$data.availableSols = [];
          this.loading = true;
          this.fetchManifest(this.fetchImages, this.noPhotoCallback);
        }
    }
  }
</script>

<style>
  .photo-switch-button {
  }

  .photo-switch-button:hover, .photo-switch-button:active, .photo-switch-button:focus {
    text-decoration: none;
  }

  .mars-image {
    max-height: calc(100vh - 83px);
    max-width: calc(100vw - 80px);
  }

  .mars-image-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    top: 0;
    left: 0;
    font-size: 60px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .mars-image-container {
    position: relative;
    margin: 5px;
  }

  .mars-image-placeholder {
    height: calc(100vh - 82px);
    width: 85vw;
    z-index: -999;
  }

  .photo-info-box {
    display: block;
    position: fixed;
    bottom: 76px;
    left: 0;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.7);
    max-width: 30vw;
  }

  .sol-buttons {
    display: flex;
    position: fixed;
    bottom: 16px;
    left: 0;
    padding: 15px;
    flex-flow: row;
  }

  .sol-button {
    margin: 3px;
  }

</style>