const HOST = "/";
const _BASE_API_URI = HOST + "api/v1/";
const _BASE_PROXY_URI = _BASE_API_URI + "nasa/";

export const LOGIN_URL = HOST + "login/facebook";
export const USER_URI = _BASE_API_URI + "user";
export const LOGOUT_URL = HOST + "logout";

export const URIs = {
  rovers: _BASE_PROXY_URI + "rovers/",
  photos: {
    curiosity: _BASE_PROXY_URI + "rovers/curiosity/photos",
    opportunity: _BASE_PROXY_URI + "rovers/opportunity/photos",
    spirit: _BASE_PROXY_URI + "rovers/spirit/photos"
  },
  manifest: {
    curiosity: _BASE_PROXY_URI + "manifests/curiosity",
    opportunity: _BASE_PROXY_URI + "manifests/opportunity",
    spirit: _BASE_PROXY_URI + "manifests/spirit"
  }
};
