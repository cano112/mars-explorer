package pl.edu.agh.marsexplorer.model;

import org.springframework.data.annotation.Id;

public class Photo {

    @Id
    private String id;
    private Rover rover;
    private CameraType cameraType;
    private int sol;
    private String url;

    public Photo() {}
    public Photo(String url, Rover rover, CameraType cameraType, int sol) {
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

        if (sol != photo.sol) return false;
        if (id != null ? !id.equals(photo.id) : photo.id != null) return false;
        if (rover != photo.rover) return false;
        if (cameraType != photo.cameraType) return false;
        return url != null ? url.equals(photo.url) : photo.url == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (rover != null ? rover.hashCode() : 0);
        result = 31 * result + (cameraType != null ? cameraType.hashCode() : 0);
        result = 31 * result + sol;
        result = 31 * result + (url != null ? url.hashCode() : 0);
        return result;
    }
}
