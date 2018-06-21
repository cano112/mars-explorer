import axios from 'axios';
import {URIs} from "../config/ApiConfig";

export class RoverService {
  /**
   * Fetch rover manifest from NASA API
   * @param rover rover name, case doesn't matter
   * @param onSuccess callback on success
   * @param onError callback on error
   */
    static getRoverManifest(rover, onSuccess, onError) {
      axios.get(URIs.manifest[rover.toLowerCase()])
        .then(onSuccess)
        .catch(onError);
    }
}

