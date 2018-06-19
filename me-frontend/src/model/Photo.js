import {Camera} from './Camera';
import {Rover} from './Rover';

export class Photo {
  constructor(obj) {
    this._id = obj.id;
    this._sol = obj.sol;
    this._earthDate = obj.earth_date;
    this._imgSrc = obj.img_src;
    this._camera = {};
    this._rover = {};
    Object.assign(this._camera, new Camera(obj.camera));
    Object.assign(this._rover, new Rover(obj.rover));
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get sol() {
    return this._sol;
  }

  set sol(value) {
    this._sol = value;
  }

  get earthDate() {
    return this._earthDate;
  }

  set earthDate(value) {
    this._earthDate = value;
  }

  get imgSrc() {
    return this._imgSrc;
  }

  set imgSrc(value) {
    this._imgSrc = value;
  }

  get camera() {
    return this._camera;
  }

  set camera(value) {
    this._camera = value;
  }

  get rover() {
    return this._rover;
  }

  set rover(value) {
    this._rover = value;
  }
}
