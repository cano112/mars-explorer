<template>
  <div id="rover-template">
    <h1>Prop value is {{roverName}}</h1>
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
                  comment='
                  keyboard=false
                  cycling=false
                  '
                  indicators
                  @sliding-start="onSlideStart"
                  @sliding-end="onSlideEnd">
        <b-carousel-slide v-for="image in images" :key="image.id"
                          :caption="`1Images placeholder slideNumber=${slide} key= ${image.id}`"
                          :text="`Nulla vitae elit libero, a pharetra augue mollis interdum. ${image.getImgSrc}`"
                          :img-src="`${image.getImgSrc}`"
                          comment=' img-src="https://picsum.photos/1024/480/?image=52"'></b-carousel-slide>


      </b-carousel>
    </div>
    <div>
      <b-progress :value="slide" :max="images.length" show-progress animated></b-progress>
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
      console.log("created rover tab with slider");
      NasaMarsApiWrapper.getManifestByRover(this.$data.photoManifest, Statics.rovers.curiosity);
      this.$data.request = PhotoRequest.builder().setPage(1).setSol(100).setRover(Statics.rovers[this.$props.roverName.toLowerCase()]).build();
      this.$data.requester = new PhotoPageRequester(this.$data.request);
      this.$data.requester.observers.push(this.loadNewImagesFromRequester);
      this.$data.requester.requestNextPage();
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

      }
    },

    methods: {
      onSlideStart(slide) {
        this.sliding = true;
        return false;
      },
      onSlideEnd(slide) {
        this.sliding = false;
        return false;
      },
      loadNewImagesFromRequester(images) {
        console.log("loadNewImagesFromRequester");
        console.log(images);
        this.$data.images.push(...images.photos);
      },
      nextPage() {
        this.$data.requester.requestNextPage();
      }

    },
    //WARNING NEVER USE value :() => {} it cause this returning {a:VueObject}}
    // https://vuejs.org/v2/api/#watch
    watch: {
      slide(newV, oldV) {
        console.log(this);
        if (newV > oldV && (this.$data.slide + 1) >= this.$data.images.length) {
          this.nextPage();
        }
      },
      photoManifest() {
        console.log("Changed Manifest")
      }
    }
  }
</script>
<style lang="scss">
  .carouserImages img {
    max-height: 600px;
  }
</style>
