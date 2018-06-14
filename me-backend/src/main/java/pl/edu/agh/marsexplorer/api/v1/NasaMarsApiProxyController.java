package pl.edu.agh.marsexplorer.api.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.marsexplorer.service.ProxyService;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1")
public class NasaMarsApiProxyController {

    private final ProxyService proxyService;

    @Autowired
    public NasaMarsApiProxyController(ProxyService proxyService) {
        this.proxyService = proxyService;
    }

    @RequestMapping("/nasa/**")
    @ResponseBody
    public String proxyRequest(@RequestBody(required = false) String requestBody,
                               HttpMethod httpMethod,
                               HttpServletRequest request) {
        final String resourceString = request.getRequestURI().split("/nasa/")[1];
        final String queryString = request.getQueryString();
        return proxyService.redirectRequest(requestBody, httpMethod, resourceString, queryString);
    }
}
