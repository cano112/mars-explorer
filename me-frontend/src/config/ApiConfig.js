const _BASE_URI = "http://localhost:8080/api/v1/nasa/";

export const URIs = {
  rovers: _BASE_URI + "rovers/",
  photos: {
    curiosity: _BASE_URI + "rovers/curiosity/photos",
    opportunity: _BASE_URI + "rovers/opportunity/photos",
    spirit: _BASE_URI + "rovers/spirit/photos"
  },
  manifest: {
    curiosity: _BASE_URI + "manifests/curiosity",
    opportunity: _BASE_URI + "manifests/opportunity",
    spirit: _BASE_URI + "manifests/spirit"
  }
};
