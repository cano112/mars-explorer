import axios from 'axios';

/**
 * Simple class that allows us to view photos by its properties
 *  API https://api.nasa.gov/api.html#Images examples:
 * - QUERY https://images-api.nasa.gov/search?q=curiosity/photos
 * - MANIFEST FROM ROVER CURIOSITY
 *      https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/
 * - ROVERS
 *      https://api.nasa.gov/mars-photos/api/v1/rovers/
 * - PHOTOS for sol = 0
 *      https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=0
 */

export class NasaMarsApiWrapper {
  static getRovers(dataBind) {
    // const uri = Statics.URI + Statics.endpoints.rovers + "?api_key=" + Statics.api_key;
    const uri = Statics.URI + Statics.endpoints.rovers;
    console.log(uri);
    console.log("URI IS :: " + uri);
    axios.get(uri, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "dasdadad": "bye"
      }
    }).then(response => {
      console.log("RESPONSE:: ");
      console.log(response.data.rovers.map(x => new Rover(x)));
      dataBind.rovers = response.data.rovers.map(x => new Rover(x));
    }, err => {
      console.log(new RequestError(arguments.callee.name, error));

    })
  }

  static getManifest(x) {
    console.log("MANIFEST");
    console.log(x);
    console.log("formated manifest");
    let z = new PhotoManifest(x.photo_manifest);
    console.log(z);
    return z
  }


  /**

   * Make request for manifest of specified rover and saves it to responseTo.data
   * @param {Object } responseTo - to this object method will add data property
   * @param {String} rover - name of rover
   */
  static getManifestByRover(responseTo, rover) {

    let roverName = rover.toLowerCase();
    if (Statics.endpoints.manifest.hasOwnProperty(roverName)) {
      NasaMarsApiWrapper.requestPromiseWrapperResponse(Statics.URI + Statics.endpoints.manifest[roverName], {}, responseTo, NasaMarsApiWrapper.getManifest);
    }
    else {
      throw new InvalidRequestException("invalid rover name");
    }
  }

  static parseUrlQuery(url, query) {
    return [url, Object.entries(query).map(x => x.map(encodeURIComponent).join("=")).join("&")].reduce((x, y) => {
      if (y.length) {
        return x + "?" + y;
      }
      return x;
    });
  }


  /**
   * Request
   * @param {PhotoRequest} requestObject
   */
  static requestPhotos(requestObject) {
    let request = {};
    if (requestObject === undefined) {
      throw new InvalidRequestException("No request object specified is invalid request object")
    }
    if (requestObject === null) {
      throw new InvalidRequestException("Null is not valid request object")
    }
    if (!requestObject instanceof PhotoRequest) {
      throw new InvalidRequestException("Unsupported request object");
    }
    if (requestObject.rover == null) {
      throw new InvalidRequestException("Unspecified rover");
    }
    console.log(requestObject.query.earth_date);
    if (requestObject.query.sol != null && requestObject.query.earth_date != null) {
      throw new InvalidRequestException("Cannot request for both sol and earth_date at the same time");
    } else {
      if (requestObject.query.sol instanceof Integer) {
        request.sol = requestObject.query.sol.getNumber();
      }

      if (PhotoRequest.validDateOrNull(requestObject.query.earth_date) != null) {
        request.date = Utils.dateToIsoDateString(requestObject.query.earth_date)
      }

    }
    if (requestObject.query.camera != null) {
      //check if valid camera for this rover
      request.camera = requestObject.query.camera
    }

    if (requestObject.query.page !== null) {
      if (Integer.isInteger(requestObject.query.page) && requestObject.query.page >= 0) {
        console.log(requestObject.query.page);
        console.log(Integer.isInteger(requestObject.query.page));
        console.log(requestObject.query.page >= 0);


        request.page = requestObject.query.page.getNumber()
      } else {
        throw new InvalidRequestException("Invalid page number");
      }
    }
    //ALL IS GOOD
    console.log("requestPhotos fine");
    return NasaMarsApiWrapper.requestPromise(Statics.URI + Statics.endpoints.photos[requestObject.rover], request)

  }

  static requestPromise(url, query) {
    console.log("REQUEST ");
    // query.api_key = Statics.api_key;
    let s = NasaMarsApiWrapper.parseUrlQuery(url, query);
    console.log(s);
    return axios.get(s, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  static requestPromiseWrapperResponse(url, query, data, wrappingFunction) {
    NasaMarsApiWrapper.requestPromise(url, query).then(
      response => {
        console.log("RESPONSE DATA");
        console.log(response.data);
        data.data = wrappingFunction(response.data);
      },
      error => {
        console.log(new RequestError(arguments.callee.name, error))
      }
    )
  }
}


export class PhotoPageRequester {
  /**
   *
   * @param {PhotoRequest} requestObject
   * @param {PhotoManifest} filteredManifest we get getPhotosDetails from it as use as iterator
   */
  constructor(requestObject, filteredManifest) {
    this.observers = [];
    this.requestObject = requestObject;
    this.photoDetails = filteredManifest.getPhotosDetails;
    this.solIndex = 0;
    this.setPageToZero();
    this.requestObject.query.sol= new Integer(this.photoDetails[this.solIndex].sol);
    console.log("getPhotosDetails");
    console.log(this.photoDetails);
  }

  hasNextPhotoDetail(){
    return  this.solIndex <= this.photoDetails.length;
  }

  /**
   * Filtering the manifest basing on request query
   * Doesn't filter page
   * Doesn't support filtering by earth date u can use converter for rover to convert earth-date to sol
   * Doesn't check if u pass correct data for the same rover
   * @param {PhotoManifest} photoManifest -manifest for current rover
   * @param {PhotoRequest} requestObject -request for current rover
   * @return {PhotoManifest|Null} filteredManifest -returned value is filtered manifest object with altered PhotosDetails array
   */
  static queryManifestFilter(photoManifest, requestObject) {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(photoManifest);
    console.log(requestObject);
    let photoManifestCopy = new PhotoManifest(photoManifest);
    let tmp = photoManifest.photos.filter(x => this._queryManifestFilter(x, requestObject));
    console.log(tmp);
    photoManifestCopy.photos =tmp;
    console.log(photoManifestCopy);
    return photoManifestCopy;
  }

  /**
   *
   * @param {PhotosDetails} photosDetails -details filter
   * @param {PhotoRequest} requestObject -request for current rover
   * @return {Boolean} flag -does photosDetails satisfy filter from requestObject
   * @private
   */
  static _queryManifestFilter(photosDetails, requestObject) {

    if (requestObject.query.camera) {
      if (photosDetails.getCameras().filter(x => x.name === requestObject.query.camera).length === 0) {
        return false;
      }
    }
    if (requestObject.query.sol) {
      if (photosDetails.getSol() !== requestObject.query.sol) {
        return false;
      }
    }
    return true;
  }

  setPageToZero() {
    this.requestObject.query.page = new Integer(1);
  }

  requestPage() {
    NasaMarsApiWrapper.requestPhotos(this.requestObject).then(response => {
      const tmp = new PhotoPage(response.data);
      if(tmp.photos.length === 0){
         this.nextSolAndGet();
      }else {
        this.requestObject.query.page.number += 1;
        this.observers.forEach(x => {
          x(tmp);
        });
      }
    }, error => {
      console.log(new RequestError(arguments.callee.name, error))
    });
  }

  requestNextPage() {

    // this.requestPage();
  }


  nextSolAndGet() {
    if( !this.hasNextPhotoDetail()){
      return false;
    }
    console.log("currentSol is ");
    console.log(this.photoDetails[this.solIndex].sol);
    console.log("nextSol is ");
    this.solIndex += 1;
    console.log(this.photoDetails[this.solIndex].sol);
    this.requestObject.query.sol.number = this.photoDetails[this.solIndex].sol;
    this.setPageToZero();
    this.requestPage();
  }

  hasNextSol() {

  }

  /*
    if (object !== undefined) {
    this.rover = object.rover || null;
    this.query = {};
    this.query.camera = object.camera || null;
    this.query.sol = Integer.integerOrNull(new Integer(object.sol));
    this.query.page = Integer.integerOrNull(new Integer(object.page));
    if (object.earth_date !== undefined) {
    this.query.earth_date = PhotoRequest.validDateOrNull(new Date(object.earth_date || null));
  } else {
    this.query.earth_date = null;
  }
  */


}


export class Photo {
  /**
   *
   * @param {Object} responseObject
   */
  constructor(responseObject) {
    Object.assign(this, responseObject);
    Object.assign(this.camera, new Camera(this.camera));
    Object.assign(this.rover, new Camera(this.rover));
  }

  get getId() {
    return this.id;
  }

  get getSol() {
    return this.sol;
  }


  get getEarthDate() {
    return this.earth_date;
  }

  get getCamera() {
    return this.camera;
  }

  get getImgSrc() {
    return this.img_src;
  }

  get getRover() {
    return this.rover;
  }

}


export class PhotoPage {
  constructor(obj) {
    this.photos = obj.photos.map(x => new Photo(x));
  }

  get getPhotos() {
    return this.photos;
  }
}


/**
 * PhotoRequest class represents a Photos request
 */
export class PhotoRequest {
  /**
   * Wrapping js object to unified request format
   * @param {Object} object
   */
  constructor(object) {
    if (object !== undefined) {
      this.rover = object.rover || null;
      this.query = {};
      this.query.camera = object.camera || null;
      this.query.sol = Integer.integerOrNull(new Integer(object.sol));
      this.query.page = Integer.integerOrNull(new Integer(object.page));
      if (object.earth_date !== undefined) {
        this.query.earth_date = PhotoRequest.validDateOrNull(new Date(object.earth_date || null));
      } else {
        this.query.earth_date = null;
      }

    }
  }

  /**
   * @return {PhotoRequestBuilder} -- builder object for PhotoRequest
   */
  static builder() {
    return new PhotoRequestBuilder();
  }

  static validDateOrNull(date) {
    if (date) {
      return null;
    }
  }
}


class PhotoRequestBuilder {
  constructor() {
    this.object = {}
  }

  setRover(rover) {
    this.object.rover = rover;
    return this;
  }

  setCamera(camera) {
    this.object.camera = camera;
    return this;
  }

  setSol(sol) {
    this.object.sol = sol;
    return this;
  }

  setPage(page) {
    this.object.page = page;
    return this;
  }

  setEarthDate(date) {
    this.object.date = date;
    return this;
  }

  build() {
    return new PhotoRequest(this.object);
  }
}


export class Integer {
  constructor(number) {

    if (number instanceof Integer) {
      this.number = number;
      return this;
    }
    if (Number.isInteger(number)) {
      this.number = number;
      return this;
    }
    return {};
  }

  static parseInteger(number) {
    if (Number.isInteger(number)) {
      return new Integer(tmp);
    }
    return null;
  }

  static integerOrNull(integer) {
    return integer instanceof Integer ? integer : null;
  }

  static isInteger(number) {
    return number instanceof Integer;
  }

  valueOf() {
    return this.getNumber();
  }

  getNumber() {
    return this.number;
  }
}


export class Camera {
  constructor(obj) {
    /*obj && */
    if(typeof  obj  === "string"){
      this.name = obj;
    } else{
      Object.assign(this, obj);
    }
  }

  get getName() {
    return this.name;
  }

  get getFullName() {
    return this.full_name;
  }

}


/**
 * Wrapper for response from https://api.nasa.gov/mars-photos/api/v1/rovers/
 */
export class Rover {
  /**
   * @param {Object} obj - Wrapping response object
   */
  constructor(obj) {
    /*obj && */
    Object.assign(this, obj);
    Object.assign(this.cameras, this.cameras.map(x => new Camera(x)));
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
export class PhotoManifest {
  constructor(obj) {
    /*obj && */
    Object.assign(this, obj);
    Object.assign(this.photos, obj.photos.map(x => new PhotosDetails(x)));


    console.log("PhotoManifest  created")
  }

  get getId() {
    return this.id;
  }

  get getRoverName() {
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

  get getPhotosDetails() {
    return this.photos
  }
}


export class PhotosDetails {
  constructor(obj) {
    Object.assign(this, obj);
    Object.assign(this.cameras, this.cameras.map(x => new Camera(x)));
  }

  getSol() {
    return this.sol;
  }

  getTotalPhotos() {
    return this.total_photos;
  }

  getCameras() {
    return this.cameras;
  }

}


export const Statics = {
  rovers: {curiosity: "curiosity", opportunity: "opportunity", spirit: "spirit"},
  // URI: "./api/v1/nasa/",
  URI: "http://localhost:8080/api/v1/nasa/",
  endpoints: {
    rovers: "rovers/",
    photos: {
      curiosity: "rovers/curiosity/photos/",
      opportunity: "rovers/opportunity/photos/",
      spirit: "rovers/spirit/photos/"
    },
    manifest: {
      curiosity: "manifests/curiosity/",
      opportunity: "manifests/opportunity/",
      spirit: "manifests/spirit/"
    }
  },
};


export class Utils {
  /**
   * @param {Date} date
   * @returns {string}
   */
  static dateToIsoDateString(date) {
    return date.toISOString().substring(0, 10);
  }

}


export class RequestError {
  /**
   * Error while waiting for response
   * @param {Object} error -- error object
   * @param {*}argumentsX --other information for example name of method
   */
  constructor(error, argumentsX) {
    this.in = argumentsX;
    this.error = error;
  }

}


export class InvalidRequestException {
  /**
   *
   * @param {String|Object} reason
   */
  constructor(reason) {
    this.reason = reason;
    this.name = "InvalidRequestException";
  }

}


export class Test {
  static testRequestPhotosCuriositySol2() {
    let tmp = PhotoRequest.builder().setPage(0).setRover(Statics.rovers.curiosity).build();
    console.log("Log" + tmp);
    tmp = NasaMarsApiWrapper.requestPhotos(tmp);
    return tmp;
  }

  static testRequestCuriosityPage1Sol1() {
    let f = (obj) => console.log(obj);
    let u = PhotoRequest.builder().setPage(1).setSol(0).setRover(Statics.rovers.curiosity).build();
    let r = new PhotoPageRequester(u);
    r.observers.push(f);
    r.requestPage();
  }

  static testFilter() {
    const req = PhotoRequest.builder().setRover(Statics.rovers.curiosity).setCamera("CHEMCAM").build();
    let data = {
      set data(x) {
        console.log("was");
        const z = PhotoPageRequester.this.$data.filteredManifestqueryManifestFilter(x, req);
        console.log(z);
      }
    };
    NasaMarsApiWrapper.getManifestByRover(data, Statics.rovers.curiosity);
  }

}
