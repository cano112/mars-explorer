package pl.edu.agh.marsexplorer.service.impl;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.edu.agh.marsexplorer.service.ProxyService;

import java.net.URI;

import static com.google.common.base.Preconditions.checkArgument;

@Service
public class NasaApiProxyService implements ProxyService {

    private final String apiKey;
    private final String apiUrl;
    private final RestTemplate restTemplate;

    public NasaApiProxyService(@Value("${mars.explorer.nasa.api.key:DEMO_KEY}") String apiKey,
                               @Value("${mars.explorer.nasa.api.url:https://api.nasa.gov/mars-photos/api/v1/}") String apiUrl,
                               RestTemplate restTemplate) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.restTemplate = restTemplate;
    }
    public String redirectRequest(String requestBody, HttpMethod httpMethod, String resourceString, String queryString) {
       URI uri = createApiRequestUri(resourceString, queryString);

        ResponseEntity<String> responseEntity =
                restTemplate.exchange(uri, httpMethod, new HttpEntity<>(requestBody), String.class);
        return responseEntity.getBody();
    }

    private URI createApiRequestUri(String resourceString, String queryString) {
        checkArgument(Strings.isNotBlank(resourceString));
        checkArgument(Strings.isNotBlank(apiKey));
        checkArgument(Strings.isNotBlank(apiUrl));

        String uriString = apiUrl + resourceString + "?api_key=" + apiKey;
        if(Strings.isNotBlank(queryString)) {
            uriString += "&" + queryString;
        }
        return URI.create(uriString);
    }
}
