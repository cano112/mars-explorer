package pl.edu.agh.marsexplorer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.marsexplorer.model.domain.Photo;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.repositories.UserRepository;
import pl.edu.agh.marsexplorer.service.PhotoService;

@Service
public class PhotoServiceImpl implements PhotoService {

    private final UserRepository userRepository;

    @Autowired
    public PhotoServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void addPhoto(User user, Photo photo) {
        user.addPhoto(photo);
        userRepository.save(user);
    }

    @Override
    public void removePhoto(User user, String photoId) {
        user.removePhoto(photoId);
        userRepository.save(user);
    }
}
