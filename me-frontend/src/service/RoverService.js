import axios from 'axios';
import {URIs} from "../config/ApiConfig";

export class RoverService {
    static getRoverManifest(rover, onSuccess, onError) {
      axios.get(URIs.manifest[rover.toLowerCase()])
        .then(onSuccess)
        .catch(onError);
    }
}

