package pl.edu.agh.marsexplorer.tests;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.agh.marsexplorer.model.domain.CameraType;
import pl.edu.agh.marsexplorer.model.domain.Photo;
import pl.edu.agh.marsexplorer.model.domain.Rover;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.service.PhotoService;
import pl.edu.agh.marsexplorer.tests.base.IntegrationTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public final class PhotoIntegrationTest extends IntegrationTest {

    @Autowired
    private PhotoService photoService;

    @Test
    public void testPhotoIsPersisted() {
        // given
        final String externalId = "aa";
        final User user = userRepository.save(new User(externalId, "Kamil"));
        final Photo photo = new Photo("id", "/photo/1", Rover.CURIOSITY, CameraType.CHEMCAM, 2);

        // when
        photoService.addPhoto(user, photo);

        // then
        final List<Photo> photos = userRepository.findByFacebookId(externalId).get().getPhotos();
        assertThat(photos).contains(photo);
    }

    @Test
    public void testPhotosUnique() {
        // given
        final String externalId = "aa";
        final User user = userRepository.save(new User(externalId, "Kamil"));
        final Photo photo1 = new Photo("id", "/photo/1", Rover.CURIOSITY, CameraType.CHEMCAM, 2);
        final Photo photo2 = new Photo("id", "/photo/1", Rover.SPIRIT, CameraType.FHAZ, 3);

        // when
        photoService.addPhoto(user, photo1);
        photoService.addPhoto(user, photo2);

        // then
        final List<Photo> photos = userRepository.findByFacebookId(externalId).get().getPhotos();
        assertThat(photos).hasSize(1);
        assertThat(photos.get(0)).isEqualTo(photo1);
    }

    @Test
    public void testRemovingPhoto() {
        // given
        final String externalId = "aa";
        final String photoId1 = "id1";
        final String photoId2 = "id2";
        final User user = userRepository.save(new User(externalId, "Kamil"));
        final Photo photo1 = new Photo(photoId1, "/photo/1", Rover.CURIOSITY, CameraType.CHEMCAM, 2);
        final Photo photo2 = new Photo(photoId2, "/photo/1", Rover.SPIRIT, CameraType.FHAZ, 3);
        photoService.addPhoto(user, photo1);
        photoService.addPhoto(user, photo2);

        // when
        photoService.removePhoto(userRepository.findByFacebookId(externalId).get(), photoId1);

        // then
        final List<Photo> photos = userRepository.findByFacebookId(externalId).get().getPhotos();
        assertThat(photos).hasSize(1);
        assertThat(photos.get(0)).isEqualTo(photo2);
    }
}
