package pl.edu.agh.marsexplorer;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.repositories.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;


public class UserRepositoryTest extends IntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void setUp() {
        userRepository.deleteAll();
    }

    @Override
    public void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    public void testUserIsPersistedWithCorrectId() {
        //given
        User user = new User("id", "John Smith");

        //when
        userRepository.save(user);
        Optional<User> userFromDb = userRepository.findByFacebookId(user.getFacebookId());

        //then
        assertThat(userFromDb.isPresent()).isTrue();
        assertThat(userFromDb.get().getFacebookId()).isEqualTo(user.getFacebookId());
        assertThat(userFromDb.get().getId())
                .isNotNull()
                .isEqualTo(user.getId());
    }


}
