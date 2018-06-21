package pl.edu.agh.marsexplorer.api.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserController extends BaseController {

    @Autowired
    protected UserController(UserService userService) {
        super(userService);
    }

    @GetMapping("user")
    public User user(OAuth2Authentication principal) {
        if(principal == null) {
            return new User("guest", "guest");
        }
        return getCurrentUser(principal);
    }
}
