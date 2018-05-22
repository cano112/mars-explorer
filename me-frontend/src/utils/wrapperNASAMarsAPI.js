import axios from 'axios';
/**
 * Simple class that allows us to view photos by its properties
 *  API https://api.nasa.gov/api.html#Images egzamples:
 * - QUERY https://images-api.nasa.gov/search?q=curiosity%20photos
 * - MANIFEST FROM ROVER CURIOSITY https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi
 * - ROVERS https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi
 * - PHOTOS for sol = 0 https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi&sol=0
 *
 */
export class WrapperNASAMarsAPI {
  static getAllCuriosityImages() {
    /**
     * @return Rover []
     */
    getRovers()
    return ["aaa", "bbbb"];
  }

  static getRovers(dataBind){
    const uri = Statics.nasaMarsAPI.URI+Statics.nasaMarsAPI.rovers.URI+"?api_key="+Statics.key;
    const test = "https://randomuser.me/api/";
    console.log("URI IS :: " + uri);
    axios.get(uri,{
      headers: {
        'Access-Control-Allow-Origin': '*',
      }}).then(response => {
      console.log("RESPONSE:: ");
      console.log(response.data.rovers.map(x => new Rover(x)));
      dataBind.rovers = response.data.rovers.map(x => new Rover(x));
    }, err => {
      console.log("ERR");
    } )


  }
}

export class Camera {
  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  get getName() {
    return this.name;
  }

  get getFullName() {
    return this.full_name;
  }


}

export class Rover{

  constructor(obj) {
    obj && Object.assign(this, obj);
    Object.assign(this.cameras,obj.cameras.map(x => new Camera(x)));
  }

  get getId() {
    return this.id;
  }

  get getName() {
    return this.name;
  }

  get getLandingDate() {
    return this.landing_date;
  }

  get getLaunchDate() {
    return this.launch_date;
  }

  get getStatus() {
    return this.status;
  }

  get getMaxSol() {
    return this.max_sol;
  }

  get getMaxDate() {
    return this.max_date;
  }

  get getTotalPhotos() {
    return this.total_photos;
  }
  get getCameras() {
    // return this.cameras.map(x => new Camera(x));
    return this.cameras;
  }

}

/**
 * Wrapper for PhotoManifest endpoint request
 */

export class PhotoManifest{
  constructor(obj) {
      obj && Object.assign(this, obj);
  }
  get getRoverName() {
    return this.name;
  }
  get getLandingDate(){
    return this.landing_date;
}
  get getLaunchDate(){
    return this.launch_date;
}
  get getStatus(){
    return this.status;
  }
  get getMaxSol(){
    return this.max_sol;
  }
  get getMaxDate(){
    return this.max_date
  }

}

export class ApiRequestValues{
  constructor(){}
}



export const Statics  = {
  key :  'd4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi',
  rovers: ["Curiosity", "Opportunity","Spirit"],
  nasaMarsAPI : {
    URI : "https://api.nasa.gov/mars-photos/api/v1/",
    rovers: {
      URI : "rovers/" ,
      endpoints: this.rovers,
    },
    manifest : {
      URI : "manifest/" ,
      endpoints: this.rovers,
    }

  },


}




