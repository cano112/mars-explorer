package pl.edu.agh.marsexplorer.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.marsexplorer.model.Photo;
import pl.edu.agh.marsexplorer.model.Rover;

import java.util.stream.Stream;

public interface PhotoRepository extends MongoRepository<Photo, String> {
    Stream<Photo> findAllByRover(Rover rover);
}
