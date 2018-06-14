package pl.edu.agh.marsexplorer.service;

import pl.edu.agh.marsexplorer.model.domain.Photo;
import pl.edu.agh.marsexplorer.model.domain.User;

public interface PhotoService {
    void addPhoto(User user, Photo photo);
    void removePhoto(User user, String photoId);
}
