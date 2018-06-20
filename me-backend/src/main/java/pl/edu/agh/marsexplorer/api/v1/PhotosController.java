package pl.edu.agh.marsexplorer.api.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.marsexplorer.model.domain.Photo;
import pl.edu.agh.marsexplorer.service.PhotoService;
import pl.edu.agh.marsexplorer.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PhotosController extends BaseController {

    private final PhotoService photoService;

    @Autowired
    protected PhotosController(UserService userService, PhotoService photoService) {
        super(userService);
        this.photoService = photoService;
    }

    @GetMapping("photos")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<Photo> getPhotos(OAuth2Authentication principal) {
        return getCurrentUser(principal).getPhotos();
    }

    @PostMapping("photos")
    @PreAuthorize("hasRole('ROLE_USER')")
    public void addPhoto(@RequestBody Photo request, OAuth2Authentication principal) {
        photoService.addPhoto(getCurrentUser(principal), request);
    }

    @DeleteMapping("photos/{photo_id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public void removePhoto(@PathVariable("photo_id") String photoId, OAuth2Authentication principal) {
        photoService.removePhoto(getCurrentUser(principal), photoId);
    }
}
