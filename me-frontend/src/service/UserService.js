import {USER_URI, LOGOUT_URL} from "../config/ApiConfig";
import axios from "axios/index";

export class UserService {

  /**
   * Deauthorize application
   * @param onSuccess callback on success
   */
  static logout(onSuccess) {
    axios.post(LOGOUT_URL)
      .then(response => {
        onSuccess()
      });
  }

  /**
   * Fetch user data
   * @param onSuccess callback on success
   * @param onError callback on error
   */
  static getUserData(onSuccess, onError) {
    axios.get(USER_URI)
      .then(response => {
        onSuccess(response.data);
      })
      .catch(onError);
  }

  /**
   * Use only in getter to make reactive.
   * @returns {boolean}
   */
  static isAuthenticated() {
    return localStorage.getItem('userAuthenticated') === 'true';
  }

  /**
   * Use only in getter to make reactive.
   * @param value true if authenticated
   */
  static setAuthenticated(value) {
    localStorage.setItem('userAuthenticated', value);
  }

  /**
   * Use only in getter to make reactive.
   * @returns {string | null}
   */
  static getUserName() {
    return localStorage.getItem('userFullName');
  }

  /**
   * Use only in getter to make reactive.
   * @param name
   */
  static setUserName(name) {
    localStorage.setItem('userFullName', name);
  }

  /**
   * Use only in getter to make reactive.
   * @returns {string | null}
   */
  static getUserId() {
    return localStorage.getItem('userId');
  }

  /**
   * Use only in getter to make reactive.
   * @param id
   */
  static setUserId(id) {
    return localStorage.setItem('userId', id);
  }
}
