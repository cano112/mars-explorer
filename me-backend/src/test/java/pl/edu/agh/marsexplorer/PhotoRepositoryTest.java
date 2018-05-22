package pl.edu.agh.marsexplorer;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.agh.marsexplorer.model.CameraType;
import pl.edu.agh.marsexplorer.model.Photo;
import pl.edu.agh.marsexplorer.model.Rover;
import pl.edu.agh.marsexplorer.repositories.PhotoRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

public class PhotoRepositoryTest extends IntegrationTest {

    @Autowired
    private PhotoRepository photoRepository;

    @Override
    public void setUp() {
        photoRepository.deleteAll();
    }

    @Override
    public void tearDown() {
        photoRepository.deleteAll();
    }

    @Test
    public void testPhotoIsPersistedWithCorrectId() {
        //given
        Photo photo = new Photo("http://google.com", Rover.CURIOSITY, CameraType.CHEMCAM, 1000);

        //when
        photoRepository.save(photo);
        List<Photo> photos = photoRepository.findAllByRover(Rover.CURIOSITY).collect(Collectors.toList());

        //then
        assertThat(photos).hasSize(1);
        assertThat(photos).contains(photo);
    }
}
