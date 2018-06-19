import {Camera} from './Camera';

export class Rover {
  constructor(obj) {
    this._id = obj.id;
    this._name = obj.name;
    this._launchDate = obj.launch_date;
    this._landingDate = obj.landing_date;
    this._status = obj.status;
    this._maxSol = obj.max_sol;
    this._maxDate = obj.max_date;
    this._totalPhotos = obj.total_photos;
    this._cameras = {};
    Object.assign(this._cameras, obj.cameras.map(x => new Camera(x)));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get launchDate() {
    return this._launchDate;
  }

  set launchDate(value) {
    this._launchDate = value;
  }

  get landingDate() {
    return this._landingDate;
  }

  set landingDate(value) {
    this._landingDate = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

  get maxSol() {
    return this._maxSol;
  }

  set maxSol(value) {
    this._maxSol = value;
  }

  get maxDate() {
    return this._maxDate;
  }

  set maxDate(value) {
    this._maxDate = value;
  }

  get totalPhotos() {
    return this._totalPhotos;
  }

  set totalPhotos(value) {
    this._totalPhotos = value;
  }

  get cameras() {
    return this._cameras;
  }

  set cameras(cameras) {
    this._cameras = cameras;
  }
}

export const ROVERS = ['Curiosity', 'Opportunity', 'Spirit'];

export const CAMERAS = {
  curiosity: ['fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi', 'navcam'],
  opportunity: ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites'],
  spirit: ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites'],
};
