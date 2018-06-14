package pl.edu.agh.marsexplorer.service;

import org.springframework.http.HttpMethod;

public interface ProxyService {
    String redirectRequest(String requestBody, HttpMethod httpMethod, String resourceString, String queryString);
}
