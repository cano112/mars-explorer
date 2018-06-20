import {USER_URI, LOGOUT_URL} from "../config/ApiConfig";
import axios from "axios/index";

export class UserService {

  static logout(onSuccess) {
    axios.post(LOGOUT_URL)
      .then(response => {
        this._clearLocalStorageUserData()
        onSuccess()
      })
      .catch(error => {
        console.log(error);
      })
  }
  static getUserData(onSuccess, onError) {
    axios.get(USER_URI, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }})
      .then(response => {
        onSuccess(response.data);
      })
      .catch(error => {
        onError();
      })
  }

  static isAuthenticated() {
    return localStorage.getItem('userAuthenticated') === 'true';
  }

  static setAuthenticated(value) {
    localStorage.setItem('userAuthenticated', value);
  }

  static getUserName() {
    return localStorage.getItem('userFullName');
  }

  static setUserName(name) {
    localStorage.setItem('userFullName', name);
  }

  static getUserId() {
    return localStorage.getItem('userId');
  }

  static setUserId(id) {
    return localStorage.setItem('userId', id);
  }
}
