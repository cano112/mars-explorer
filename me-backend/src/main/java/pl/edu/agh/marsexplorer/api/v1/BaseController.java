package pl.edu.agh.marsexplorer.api.v1;

import org.springframework.security.oauth2.provider.OAuth2Authentication;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.service.UserService;

import java.util.Map;

public abstract class BaseController {

    private final UserService userService;

    protected BaseController(UserService userService) {
        this.userService = userService;
    }

    @SuppressWarnings("unchecked")
    protected User getCurrentUser(OAuth2Authentication principal) {
        if(principal.getUserAuthentication().getDetails() instanceof Map) {
            Map<String, String> details = (Map<String, String>) principal.getUserAuthentication().getDetails();
            return userService.getSynchronizedUser(details.get("id"), details.get("name"));
        }
        throw new UnsupportedOperationException("Unsupported authentication object");
    }
}
