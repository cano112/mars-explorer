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
      <div class="photo-info">
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
      <div class="buttons">
        <div class="sol-button button" @click="prevSol">
          <icon name="caret-left" class="sol-button" scale="2.5"></icon>
        </div>
        <div class="sol-button button" @click="nextSol">
          <icon name="caret-right" class="sol-button" scale="2.5"></icon>
        </div>
        <div v-if="this.$root.authenticated">
          <div v-if="favourite" @click="removeFavouritePhoto()" class="fav-button button">
            <icon name="star" scale="2.5"></icon>
          </div>
          <div v-else @click="addFavouritePhoto()" class="fav-button button">
            <icon name="star-o" scale="2.5"></icon>
          </div>
        </div>
      </div>
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
        'photos': [],
        'nextPagePhotos': [],
        'prevPagePhotos': [],
        'favPhotos': [],
        'availableSols': [],
        'currentPhotoIndex': parseInt(this.$route.params['index']),
        'page': parseInt(this.$route.params['page']),
        'loading': true,
        'favourite': false,
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
       * Redirects to /error on error.
       */
      fetchImages() {
        this.$data.loading = true;
        this.fetchPhotosPage(this.$data.page,
        response => {
          this.$data.photos = PhotoService.parsePhotos(response);
          this.loading = false;
          this.fetchFavouritePhotos();
        },
        error => {
          this.$router.replace('/error');
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
       * Fetch user's saved photos to $data.favPhotos and set $data.favourite flag.
       * Redirects to /error on error.
       */
      fetchFavouritePhotos() {
        if(this.$root.authenticated) {
          PhotoService.getUserPhotos
          (response => {
              this.$data.favPhotos = response.data;
              this.$data.favourite = this.isFavouritePhoto();
            },
            error => {
              this.$router.replace('/error');
            })
        }
      },

      /**
       * Add current photo to user's saved photos.
       * Redirects to /error on error.
       */
      addFavouritePhoto() {
        if(this.$root.authenticated) {
          let currentPhoto = this.$data.photos[this.$data.currentPhotoIndex];
          PhotoService.addUserPhoto(
            currentPhoto.id,
            currentPhoto.rover._name,
            currentPhoto.sol,
            currentPhoto.camera._name,
            this.$route.path,
            response => {
              this.fetchFavouritePhotos();
            },
            error => {
              this.$router.replace('/error');
            });
        }
      },

      /**
       * Remove current photo from user's saved photos.
       * Redirects to /error on error.
       */
      removeFavouritePhoto() {
        if(this.$root.authenticated) {
          let currentPhoto = this.$data.photos[this.$data.currentPhotoIndex];
          PhotoService.removeUserPhoto(currentPhoto.id,
          response => {
            let index = this.$data.favPhotos.findIndex(p => p.id == currentPhoto.id);
            if(index !== -1) {
              this.$data.favPhotos.splice(index, 1);
              this.$data.favourite = false;
            }
          },
          error => {
            this.$router.replace('/error');
          });
        }
      },

      /**
       * Callback invoked when no photos for a given $route.params['sol'] and $route.params['camera'].
       * Redirects to the nearest sol.
       * Redirects to /error on error (no nearest sol found).
       * @param sols sols with a given camera
       */
      noPhotoCallback(sols) {
        let nearestSol = this.getNearestSol(this.$route.params['sol'], sols);
        if(nearestSol === -1) {
          this.$router.replace('/error');
        } else {
          this.$router.replace({
            params: {
              sol: nearestSol
            }});
        }
      },

      /**
       * Fetch manifest for a given rover.
       * Redirects to /error on error.
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
          this.$router.replace('/error');
        });
      },

      /**
       * Listener on previous photo button. Moves to previous photo in a given sol - only if available.
       */
      prevPhoto() {
        if(this.$data.currentPhotoIndex > 0) { // not at bound
          this.$data.loading = true;
          this.$router.push({params: {index: this.$data.currentPhotoIndex-1}});
        } else {
          if(this.$data.currentPhotoIndex === 0 && this.$data.page >= 2) { // at left-side bound
            this.$data.loading = true;
            this.$router.push({params: {page: this.$data.page-1, index: 24}})
          }
        }
      },

      /**
       * Listener on next photo button. Moves to next photo in a given sol - only if available.
       */
      nextPhoto() {
        if(this.$data.currentPhotoIndex < this.$data.photos.length-1) { // not at bound
          this.$data.loading = true;
          this.$router.push({params: {index: this.$data.currentPhotoIndex+1}});
        } else {
          if(this.$data.currentPhotoIndex === 24) {  // at right-side bound
            this.$data.loading = true;
            this.$router.push({params: {page: this.$data.page+1, index: 0}})
          }
        }
      },

      /**
       * Listener on previous sol button. Moves to previous sol from $data.availableSols - only if available.
       * Redirects to /error on error (no nearest sol found).
       */
      prevSol() {
        let currentSolIndex = this.$data.availableSols.indexOf(parseInt(this.$route.params['sol']));
        if(currentSolIndex === -1) {
          let nearestSol = this.getNearestSol(this.$route.params['sol'], this.$data.availableSols);
          if(nearestSol === -1) {
            this.$router.replace('/error');
          } else {
            this.$router.push({
              params: {
                sol: nearestSol,
                page: 1,
                index: 0
              }});
          }
        }
        if(currentSolIndex > 0) {
          this.$router.push({
            params: {
              sol: this.$data.availableSols[currentSolIndex-1],
              page: 1,
              index: 0
            }});
        }
      },

      /**
       * Listener on next sol button. Moves to next sol from $data.availableSols - only if available.
       * Redirects to /error on error (no nearest sol found).
       */
      nextSol() {
        let currentSolIndex = this.$data.availableSols.indexOf(parseInt(this.$route.params['sol']));
        if(currentSolIndex === -1) {
          let nearestSol = this.getNearestSol(this.$route.params['sol'], this.$data.availableSols);
          if(nearestSol === -1) {
            this.$router.replace('/error');
          } else {
            this.$router.push({
              params: {
                sol: nearestSol,
                page: 1,
                index: 0
              }});
          }
        }
        if(currentSolIndex < this.$data.availableSols.length-1) {
          this.$router.push({
            params: {
              sol: this.$data.availableSols[currentSolIndex+1],
              page: 1,
              index: 0
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

      /**
       * Find nearest sol (last sol before the given one) in a given sols list.
       * @param sol reference sol
       * @param sols sols list
       * @returns {number} nearest sol
       */
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

      /**
       * Listener on image load event. Sets $data.loading flag to false.
       */
      loaded() {
        this.$data.loading = false;
      },

      /**
       * Check if current photo is on user's saved photos list.
       * @return {boolean} true if current photo is on user's saved photos list
       */
      isFavouritePhoto() {
        if(this.$data.photos[this.$data.currentPhotoIndex] != null) {
          return this.$root.authenticated &&
            this.$data.favPhotos.find(p => p.id == this.$data.photos[this.$data.currentPhotoIndex].id) != null;
        }
        return false;
      },

      /**
       * Listener on route change. Fired when rover or sol or camera changes.
       */
      onRoverSolCameraChange() {
        this.$data.availableSols = [];
        this.loading = true;
        this.fetchManifest(this.fetchImages, this.noPhotoCallback);
      },

      /**
       * Listener on route change. Fired when page changes.
       */
      onPageChange(onSuccess) {
        this.$data.loading = true;
        this.fetchPhotosPage(this.$data.page,
          response => {
          if(response.data.photos.length === 0 && this.$data.page > 1) {
            this.$router.replace({params: {page: this.$data.page-1, index: 24}})
          } else {
            this.$data.photos = PhotoService.parsePhotos(response);
            onSuccess();
            this.$data.loading = false;
          }},
          error => {
            this.$router.replace('/error');
          })
      }
    },
    watch: {
      /**
       * Watch route change
       * @param to current route
       * @param from previous route
       */
      $route(to, from) {
        if (to != null && from != null) {

          // always
          this.page = parseInt(to.params['page']);

          // on page change
          if(to.params['page'] !== from.params['page']) {
            this.onPageChange(() => {
              this.currentPhotoIndex = parseInt(to.params['index']);
              this.fetchFavouritePhotos();
            });
          } else {
            this.currentPhotoIndex = parseInt(to.params['index']);
            this.fetchFavouritePhotos();
          }

          // on sol or rover or camera change
          if (to.params['sol'] !== from.params['sol']
            || to.params['currentRover'] !== from.params['currentRover']
            || to.params['camera'] !== from.params['camera']) {
            this.onRoverSolCameraChange();
          }
        }
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
  }

  .mars-image-placeholder {
    height: calc(100vh - 82px);
    width: 85vw;
    z-index: -999;
  }

  .photo-info-box {
    display: flex;
    flex-flow: column;
    position: fixed;
    bottom: 16px;
    left: 0;
    padding: 15px;
    max-width: 30vw;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .button:hover, .button:active, .button:focus {
    cursor: pointer;
  }

  .buttons {
    display: flex;
    flex-flow: row;
    justify-content: left;
    align-items: center;
  }

  .sol-button {
    margin: 3px;
  }

  .fav-button {
    margin-left: 10px;
  }
</style>
