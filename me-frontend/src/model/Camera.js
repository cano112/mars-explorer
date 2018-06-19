export class Camera {
  constructor(obj) {
    this._name = obj.name;
    this._fullName = obj.full_name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get fullName() {
    return this._fullName;
  }

  set fullName(value) {
    this._fullName = value;
  }
}
