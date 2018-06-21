package pl.edu.agh.marsexplorer.model.domain;

import com.google.common.base.Objects;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

public class Photo {

    @Id
    @Indexed(unique = true)
    private String id;

    private Rover rover;
    private CameraType cameraType;
    private int sol;
    private String url;

    public Photo() {}
    public Photo(String id, String url, Rover rover, CameraType cameraType, int sol) {
        this.id = id;
        this.url = url;
        this.rover = rover;
        this.cameraType = cameraType;
        this.sol = sol;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Rover getRover() {
        return rover;
    }

    public void setRover(Rover rover) {
        this.rover = rover;
    }

    public CameraType getCameraType() {
        return cameraType;
    }

    public void setCameraType(CameraType cameraType) {
        this.cameraType = cameraType;
    }

    public int getSol() {
        return sol;
    }

    public void setSol(int sol) {
        this.sol = sol;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Photo photo = (Photo) o;
        return sol == photo.sol &&
                Objects.equal(id, photo.id) &&
                rover == photo.rover &&
                cameraType == photo.cameraType &&
                Objects.equal(url, photo.url);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, rover, cameraType, sol, url);
    }
}
