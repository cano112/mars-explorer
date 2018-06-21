import {Photo} from '../model/Photo';
import {URIs, USER_PHOTOS_URI} from "../config/ApiConfig";
import axios from "axios/index";

export class PhotoService {

  /**
   * Fetch rover photos from NASA API.
   * @param rover rover name, case doesn't matter.
   * @param camera camera short name (lowercase)
   * @param sol number
   * @param page page number
   * @param onSuccess callback on success
   * @param onError callback on error
   */
  static getRoverPhotos(rover, camera, sol, page, onSuccess, onError) {
    this._getRoverPhotosByResource(URIs.photos[rover.toLowerCase()], sol, page, camera, onSuccess, onError)
  }

  /**
   * Fetch user saved photos.
   * @param onSuccess callback on success
   * @param onError callback on error
   */
  static getUserPhotos(onSuccess, onError) {
    axios.get(USER_PHOTOS_URI)
      .then(onSuccess)
      .catch(onError);
  }

  /**
   * Add user's saved photo.
   * @param id NASA's photo id
   * @param rover rover name (case doesn't matter)
   * @param sol sol number
   * @param camera camera short name (case doesn't matter)
   * @param url app's resource with the given photo
   * @param onSuccess callback on success
   * @param onError callback on error
   */
  static addUserPhoto(id, rover, sol, camera, url, onSuccess, onError) {
    axios.post(USER_PHOTOS_URI, {
      id: id,
      rover: rover.toUpperCase(),
      sol: sol,
      cameraType: camera.toUpperCase(),
      url: url
    })
      .then(onSuccess)
      .catch(onError);
  }

  /**
   * Remove user's saved photo.
   * @param id NASA's photo id
   * @param onSuccess callback on success
   * @param onError callback on error
   */
  static removeUserPhoto(id, onSuccess, onError) {
    axios.delete(USER_PHOTOS_URI + "/" + id)
      .then(onSuccess)
      .catch(onError);
  }

  /**
   * Parse photos list from API response.
   * @param response API response
   * @returns {Photo[]} parsed photo list
   */
  static parsePhotos(response) {
    return response.data.photos.map(p => new Photo(p))
  }

  static _getRoverPhotosByResource(resource, sol, page, camera, onSuccess, onError) {
    axios.get(this._buildPhotosURI(resource, sol, page, camera))
      .then(onSuccess)
      .catch(onError);
  }

  static _buildPhotosURI(resource, sol, page, camera) {
    return resource + '?sol=' + sol + '&page=' + page + '&camera=' + camera
  }
}
