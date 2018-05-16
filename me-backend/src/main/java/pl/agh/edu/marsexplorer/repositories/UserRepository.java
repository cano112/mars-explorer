package pl.agh.edu.marsexplorer.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.agh.edu.marsexplorer.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByLogin(String login);
}
