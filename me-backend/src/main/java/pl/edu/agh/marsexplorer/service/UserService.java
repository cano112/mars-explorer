package pl.edu.agh.marsexplorer.service;

import pl.edu.agh.marsexplorer.model.domain.User;

/**
 * Service to synchronize app's db with externally authenticated users,
 */
public interface UserService {

    /**
     * Fetch user from db or create new if not extists.
     * @param externalId auth server's user id
     * @param name username
     * @return user model object
     */
    User getSynchronizedUser(String externalId, String name);
}
