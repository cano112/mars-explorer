package pl.edu.agh.marsexplorer.api.v1;

import org.springframework.security.oauth2.provider.OAuth2Authentication;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.service.UserService;

import java.util.Map;

/**
 * Base API's controller class. All API's controllers should extend it.
 */
public abstract class BaseController {

    private final UserService userService;

    protected BaseController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get current logged user. Supports {@link OAuth2Authentication} only.
     * @param principal principal object, injected by Spring Security
     * @return user model object
     * @throws UnsupportedOperationException when unsupported auth object
     */
    @SuppressWarnings("unchecked")
    protected User getCurrentUser(OAuth2Authentication principal) {
        if(principal.getUserAuthentication().getDetails() instanceof Map) {
            Map<String, String> details = (Map<String, String>) principal.getUserAuthentication().getDetails();
            return userService.getSynchronizedUser(details.get("id"), details.get("name"));
        }
        throw new UnsupportedOperationException("Unsupported authentication object");
    }
}
