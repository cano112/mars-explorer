package pl.edu.agh.marsexplorer.model.domain;

public enum CameraType {
    FHAZ("Front Hazard Avoidance Camera"),
    RHAZ("Rear Hazard Avoidance Camera"),
    MAST("Mast Camera"),
    CHEMCAM("Chemistry and Camera Complex"),
    MAHLI("Mars Hand Lens Imager"),
    MARDI("Mars Descent Imager"),
    NAVCAM("Navigation Camera"),
    PANCAM("Panoramic Camera"),
    MINITES("Miniature Thermal Emission Spectrometer (Mini-TES)");

    private final String description;

    CameraType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
