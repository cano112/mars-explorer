<template>
  <div id="rover-template">
    <div class="carouserImages">
      <b-carousel :id="`carousel${roverName}`"
                  data-wrap=false
                  style="text-shadow: 1px 1px 2px #333;"
                  controls
                  background="#ababab"
                  img-width="200"
                  img-height="200"
                  v-model="slide"
                  :interval="0"
                  @sliding-start="onSlideStart"
                  @sliding-end="onSlideEnd">
        <b-carousel-slide v-for="image in images"
                          :key="image.id"
                          :caption="`Camera: ${image.camera.name} ID: ${image.id}`"
                          width="1024"
                          height="480"
                          comment=':img-src="`${image.getImgSrc}`"'>
          <b-img-lazy slot="img"
                      class="d-block img-fluid w-100 slide-img img-lazy lazy"
                      width="1024" height="480"
                      :src="`${image.getImgSrc}`"
                      alt="image slot"
                      offset="1000"
                      throttle="100"
                      comment='blank-src="http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00014/opgs/edr/fcam/FRA_398741806EDR_F0030004FHAZ00200M_.JPG"'></b-img-lazy>
        </b-carousel-slide>
      </b-carousel>
    </div>
    <div>
      <b-progress :max="images.length"
                  show-value solid style="background-color:black">
        <b-progress-bar :value="slide+1">Progress: {{ slide + 1}} / {{ images.length }}</b-progress-bar>
      </b-progress>
      <div class="text-center hidden-md-down">
        <b-pagination :limit="25"
                      size="sm"
                      :total-rows="images.length"
                      v-model="page"
                      :per-page="1"
                      class="justify-content-center ">
        </b-pagination>
      </div>
      <p slot="text"
         style="text-align: center; color: #92a198;"
         v-if="images.length !== 0" >

        <a target="_blank"
           :href="`${images[slide].img_src}`" > {{images[slide].img_src}}</a>


        <br/>
        {{images[slide].rover.cameras.filter(x=> x.name ==images[slide].camera.name)[0].full_name}}
      </p>
    </div>


  </div>
</template>
<script>
  import {

    Statics,
    NasaMarsApiWrapper,
    PhotoRequest,
    PhotoPageRequester
  } from "../utils/nasaMarsApiWrapper"

  export default {
    name: 'rover-template',
    props: ['roverName'],
    created() {
      this.init();
    },
    data() {
      return {
        slide: 0,
        sliding: null,
        images: [],
        isCycling: false,
        photoManifest: {},
        query: {},
        counter: 0,
        request: {},
        requester: {},
        imageRequester: {},
        filteredManifest: {},
        page: 1,
      }
    },

    methods: {
      init() {
        const that = this;
        const req = {
          get data() {
            return {};
          },
          set data(x) {
            that.$data.photoManifest = x;
          }
        };
        NasaMarsApiWrapper.getManifestByRover(req, this.getRoverForTab());
      },
      getRoverForTab() {
        return Statics.rovers[this.$props.roverName.toLowerCase()]
      },

      onSlideStart(slide) {
        window.dispatchEvent(new Event("scroll"));
        this.sliding = true;
        //TODO install fix for old ie
        // window.dispatchEvent(new Event("scroll"));
        return false;
        this.nextSlide(slide + 1);
      },

      nextSlide(slide) {

      },

      onSlideEnd(slide) {
        this.sliding = false;
        return false;
      },
      loadNewImagesFromRequester(images) {
        if (images.photos.length > 0) {
          console.log(images);
          this.$data.images.push(...images.photos);
          window.dispatchEvent(new Event("scroll"));
        }

      },
      nextPage() {
        this.$data.requester.requestPage();
      }
    },
    //WARNING NEVER USE value :() => {} it cause this returning {a:VueObject}}
    // https://vuejs.org/v2/api/#watch
    watch: {
      page(x){
        this.$data.slide =x-1;
      },
      slide(newV, oldV) {
        this.$data.page =newV+1;
        if (newV > oldV && (this.$data.slide + 2) >= this.$data.images.length) {
          this.nextPage();
        }

      },
      photoManifest: {
        handler(val) {
          //TESTING SRT TO ALL KNOW CAMERA
          this.$data.request = PhotoRequest.builder().setCamera("NAVCAM").setRover(this.getRoverForTab()).build();
          this.$data.requester = new PhotoPageRequester(this.$data.request, val);
          console.log("#############################");
          console.log(val);
          this.$data.filteredManifest = PhotoPageRequester.queryManifestFilter(val, this.$data.request);

        },
        deep: true
      },
      filteredManifest: {
        handler(val) {
          this.$data.requester.observers.push(this.loadNewImagesFromRequester);
          this.$data.requester.requestPage();

        },
        deep: true
      }
    },
    computed: {
      slidePage() {
        return this.$data.slide - 1
      }
    }
  }
</script>

<style lang="scss">
  .carouserImages img {
    max-height: 600px;
  }
</style>
