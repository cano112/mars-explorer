package pl.edu.agh.marsexplorer.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.Objects;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String facebookId;

    private String name;

    @JsonIgnore
    private List<Photo> photos;

    public User() {}

    public User(String facebookId, String name) {
        this.facebookId = facebookId;
        this.name = name;
        this.photos = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFacebookId() {
        return facebookId;
    }

    public void setFacebookId(String facebookId) {
        this.facebookId = facebookId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(List<Photo> photos) {
        this.photos = photos;
    }

    public void addPhoto(Photo photo) {
        photos.add(photo);
    }

    public void removePhoto(String photoId) {
        photos.removeIf(photo -> photo.getId().equals(photoId));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equal(id, user.id) &&
                Objects.equal(facebookId, user.facebookId) &&
                Objects.equal(name, user.name) &&
                Objects.equal(photos, user.photos);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, facebookId, name, photos);
    }
}
