package pl.edu.agh.marsexplorer.service;

import pl.edu.agh.marsexplorer.model.domain.Photo;
import pl.edu.agh.marsexplorer.model.domain.User;

/**
 * Service to add/remove user's saved photos.
 */
public interface PhotoService {

    /**
     * Add saved photo to a given user.
     * @param user current user's model object
     * @param photo photo model object
     */
    void addPhoto(User user, Photo photo);

    /**
     * Remove saved photo from a given user.
     * @param user current user's model object.
     * @param photoId NASA's API photo identifier.
     */
    void removePhoto(User user, String photoId);
}
