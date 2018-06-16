import axios from 'axios';

/**
 * Simple class that allows us to view photos by its properties
 *  API https://api.nasa.gov/api.html#Images examples:
 * - QUERY https://images-api.nasa.gov/search?q=curiosity%20photos
 * - MANIFEST FROM ROVER CURIOSITY
 *      https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi
 * - ROVERS
 *      https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi
 * - PHOTOS for sol = 0
 *      https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=d4AMs5679WgbHT8C38EoYbCI8ssPsWEdGDRzVgEi&sol=0
 */


export class NasaMarsApiWrapper {

  /**
   * Conctructor
   * @param string key
   */
  constructor() {
    this.rovers = null;
    this._build();
  }

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
      console.log("ERR");
    })
  }

  static getManifest(x) {
    console.log("MANIFEST");
    console.log(x);
    return new PhotoManifest(x.photo_manifest);
  }


  static getManifestByRover(responseTo, rover) {

    let roverName = rover.toLowerCase();
    if (Statics.endpoints.manifest.hasOwnProperty(roverName)) {
      NasaMarsApiWrapper.requestPromiseWrapperResponse(Statics.URI + Statics.endpoints.manifest[roverName], {}, responseTo, NasaMarsApiWrapper.getManifest);
    }
    else {
      throw new InvalidRequestException("invalid rover name");
    }
  }

  static getCuriosityManifest(response) {
    return NasaMarsApiWrapper.requestPromiseWrapperResponse(Statics.URI + Statics.endpoints.manifest.curiosity, {}, response, NasaMarsApiWrapper.getManifest);
  }

  static getOpportunityManifest(response) {
    return NasaMarsApiWrapper.requestPromiseWrapperResponse(Statics.URI + Statics.endpoints.manifest.opportunity, {}, response, NasaMarsApiWrapper.getManifest);
  }

  static getSpiritManifest(response) {
    return NasaMarsApiWrapper.requestPromiseWrapperResponse(Statics.URI + Statics.endpoints.manifest.spirit, {}, response, NasaMarsApiWrapper.getManifest);
  }


  static parseUrlQuery(url, query) {
    //TODO change
    const uri = url;
    return uri + "?" + Object.entries(query).map(x => x.map(encodeURIComponent).join("=")).join("&")
  }

  static testRequestPhotosCuriositySol2() {
    let tmp = PhotoRequest.builder().setPage(0).setRover(Statics.rovers.curiosity).build();
    console.log("Log" + tmp);
    tmp = NasaMarsApiWrapper.requestPhotos(tmp);
    return tmp;
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
        request.page = requestObject.query.page.getNumber()
      } else {
        throw new InvalidRequestException("Invalid page number");
      }

    }
    //ALL IS GOOD
    console.log("requestPhotos" + " fine");
    return NasaMarsApiWrapper.request(Statics.URI + Statics.endpoints.photos[requestObject.rover], request)

  }

  static request(url, query, responseX) {
    console.log("REQUEST ");
    // query.api_key = Statics.api_key;
    let s = NasaMarsApiWrapper.parseUrlQuery(url, query);
    console.log(s);
    let request = axios.get(s, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "dasdadad": "bye"
      }
    }).then(response => {
      responseX.data = response.data;
      console.log("RESPONSE:: ");
      console.log(responseX);
      return responseX;
    }, err => {
      console.log("ERR");
    });


    // axios.get(NasaMarsApiWrapper.parseUrlQuery(url, query), {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     "dasdadad" : "bye"
    //   },
    //   crossdomain: true
    // }).then(response => {
    //   console.log("RESPONSE:: " + response.data);
    //   dataBind = response.data;
    // }, err => {
    //   console.log("ERR");
    // });
    return request;
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
        console.log("REQUEST" + url + " " + query);
      }
    )
  }


  /**
   * Builds data structures etc rovers using data from manifest
   * @private
   */
  _build() {
    NasaMarsApiWrapper.getRovers(this.rovers)
  }

  /**
   * Convert sol for data for selected rover
   * @param {RoverName} rover
   * @param {Number} sol
   */
  getDataBySol(rover, sol) {

  }

}


export class PhotoPageRequester {
  /**
   *
   * @param {PhotoRequest} requestObject
   */
  constructor(requestObject) {
    requestObject.query.page = requestObject.query.page || 0;
    this.requestObject = requestObject;
  }

  requestPage() {
    return NasaMarsApiWrapper.requestPhotos(this.requestObject);
  }

  requestNextPage() {
    this.requestObject.page += 1;
    return this.requestPage();
  }
}


/**
 * PhotoRequest class represents a object passed to NasaMarsApiWrapper.request
 *
 */
export class PhotoRequest {
  /**
   * Wrapping js object to unified request format
   * @param {Object} object
   */
  constructor(object) {

    this.camera = object.camera || null;
    this.sol = Integer.integerOrNull(new Integer(object.sol));
    this.page = Integer.integerOrNull(new Integer(object.page));
    if (object.earth_date !== undefined) {
      this.earth_date = PhotoRequest.validDateOrNull(new Date(object.earth_date || null));
    } else {
      this.earth_date = null;
    }
  }


  static builder() {
    return new PhotoRequestBuilder();
  }

  static validDateOrNull(date) {
    if (date) {
      return null;
    }
    /*  if (date instanceof Date) {
        let day = date.getDay();
        let month = date.getMonth();
        let year = date.getFullYear();

        let newdate = new Date();
        date.setFullYear(year, month, day);
        // month - 1 since the month index is 0-based (0 = January)
        return (date.getFullYear() === year) && (date.getMonth() === month) && (date.getDate() === day);
      } else {
        return null;
      }*/

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
    obj && Object.assign(this, obj);
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
    obj && Object.assign(this, obj);
    Object.assign(this.cameras, obj.cameras.map(x => new Camera(x)));
  }

  /**
   *
   * @returns {number} rover id
   */
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
    obj && Object.assign(this, obj);
    Object.assign(this.photos, obj.photos.map(x => new PhotosDetails(x)));
    // Object.assign(this.photos,obj.photos.map(new PhotosDetails(x) ).reduce((x,y) => {
    //   let map = x;
    //   x.set(y.getSol(),y);
    //   return map
    // }, new Map()));

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
    obj && Object.assign(this, obj);
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
   *
   * @param {Date} date
   * @returns {string}
   */
  static dateToIsoDateString(date) {
    return date.toISOString().substring(0, 10);
  }
}

/**
 * Request for NasaMarsApiWrapper.request()
 */


/**
 * Request error
 */
export class InvalidRequestException {
  /**
   *
   * @param {String} reason
   */
  constructor(reason) {
    this.reason = reason;
    this.name = "InvalidRequestException";
  }
}

export class CuriosityRequester {
  constructor() {
    this.data = NasaMarsApiWrapper.getCuriosityManifest();
    console.log(this.data);
  }

}
