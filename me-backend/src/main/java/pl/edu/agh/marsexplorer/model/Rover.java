package pl.edu.agh.marsexplorer.model;

import static pl.edu.agh.marsexplorer.model.CameraType.*;

public enum Rover {
    CURIOSITY("Curiosity", FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM),
    OPPORTUNITY("Opportunity", FHAZ, RHAZ, NAVCAM, PANCAM, MINITES);

    private final String roverName;
    private final CameraType[] cameras;

    Rover(String roverName, CameraType... cameras) {
        this.roverName = roverName;
        this.cameras = cameras;
    }

    public String getRoverName() {
        return roverName;
    }

    public CameraType[] getCameras() {
        return cameras;
    }
}
