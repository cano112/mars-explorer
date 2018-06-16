<template>
  <div id="rover-template">
    <h1>Prop value is {{roverName}}</h1>
    <div>
      <b-carousel :id="`carousel${roverName}`"
                  data-wrap = false
                  style="text-shadow: 1px 1px 2px #333;"
                  controls
                  background="#ababab"
                  img-width="1024"
                  img-height="480"
                  v-model="slide"
                  comment = '
                  keyboard=false
                  cycling=false
                  '
                  indicators
                  @sliding-start="onSlideStart"
                  @sliding-end="onSlideEnd"
      >
        <b-carousel-slide v-for="image in images" :caption="`1Images placeholder ${image}`"
                          text="Nulla vitae elit libero, a pharetra augue mollis interdum. "
                          img-src="https://picsum.photos/1024/480/?image=52"></b-carousel-slide>

      </b-carousel>
    </div>
  </div>
</template>
<script>
  import { PhotoManifest,Statics, Camera, NasaMarsApiWrapper,Pho }  from "../utils/nasaMarsApiWrapper"
  export default {
    name: 'rover-template',
    props: ['roverName'],
    created(){
      console.log("created rover tab with slider");
      NasaMarsApiWrapper.getManifestByRover(this.$data.photoManifest, this.roverName);
    },
    data (){
      return {
        slide :0,
        sliding: null,
        images: ["iAmObjectOf1stImage1","iAmObjectOf2ndImage2","iAmObjectOf2ndImage3","iAmObjectOf2ndImage4","iAmObjectOf2ndImage5"],
        isCycling: false,
        photoManifest:{},
        query:{},
        counter : 0,
        imageRequester: {}
      }
    },

    methods: {
      onSlideStart (slide) {
        this.sliding = true;
        return false;
      },
      onSlideEnd (slide) {
        this.sliding = false;
        return false;
      },
      loadNewImages (){
        this.images.push("newImagePushed" + this.counter)
      }
    },

    //WARNING NEVER USE value :() => {} it cause vue this returning {a:VueObject}}
    // https://vuejs.org/v2/api/#watch
    watch : {
      slide (newV,oldV){
        console.log(this);

        if ( newV > oldV  && (this.$data.slide + 1)  >= this.$data.images.length ){
          this.loadNewImages();
        }
      },
      photoManifest(){
        console.log("Changed Manifest")
      }
    }

    /*,
    computed : {
        isCycling:  false
    }*/

  }
</script>
