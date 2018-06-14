package pl.edu.agh.marsexplorer.service;

import pl.edu.agh.marsexplorer.model.domain.User;

public interface UserService {
    User getSynchronizedUser(String externalId, String name);
}
