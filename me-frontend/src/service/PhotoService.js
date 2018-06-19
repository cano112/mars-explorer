import {Photo} from '../model/Photo';
import {URIs} from "../config/ApiConfig";
import axios from "axios/index";

export class PhotoService {
  static getRoverPhotos(rover, camera, sol, page, onSuccess, onError) {
    this._getRoverPhotosByResource(URIs.photos[rover.toLowerCase()], sol, page, camera, onSuccess, onError)
  }

  static _getRoverPhotosByResource(resource, sol, page, camera, onSuccess, onError) {
    axios.get(this._buildPhotosURI(resource, sol, page, camera))
      .then(onSuccess)
      .catch(onError);
  }

  static _buildPhotosURI(resource, sol, page, camera) {
    return resource + '?sol=' + sol + '&page=' + page + '&camera=' + camera
  }
  static parsePhotos(response) {
    return response.data.photos.map(p => new Photo(p))
  }
}
