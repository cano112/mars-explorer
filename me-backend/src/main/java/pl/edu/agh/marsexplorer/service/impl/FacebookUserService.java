package pl.edu.agh.marsexplorer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.repositories.UserRepository;
import pl.edu.agh.marsexplorer.service.UserService;

@Service
public class FacebookUserService implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public FacebookUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getSynchronizedUser(String externalId, String name) {
        User user = userRepository.findByFacebookId(externalId)
                .orElseGet(() -> {
                    User newUser = new User(externalId, name);
                    userRepository.save(newUser);
                    return newUser;
                });
        if(!user.getName().equals(name)) {
            user.setName(name);
            userRepository.save(user);
        }
        return user;
    }
}
