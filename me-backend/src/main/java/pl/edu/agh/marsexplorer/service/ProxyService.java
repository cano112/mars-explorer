package pl.edu.agh.marsexplorer.service;

import org.springframework.http.HttpMethod;

/**
 * Service to proxy NASA API. Redirects requests to NASA API, appending API key.
 */
public interface ProxyService {

    /**
     * Get response from NASA API to a given request
     * @param requestBody request body
     * @param httpMethod request http method
     * @param resourceString NASA API's resource (without starting '/')
     * @param queryString query params
     * @return response body
     */
    String redirectRequest(String requestBody, HttpMethod httpMethod, String resourceString, String queryString);
}
