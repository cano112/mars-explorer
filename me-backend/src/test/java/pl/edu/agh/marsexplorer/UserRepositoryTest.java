package pl.edu.agh.marsexplorer;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import pl.edu.agh.marsexplorer.model.User;
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
        User user = new User("login", "password");

        //when
        userRepository.save(user);
        Optional<User> userFromDb = userRepository.findByLogin("login");

        //then
        assertThat(userFromDb.isPresent()).isTrue();
        assertThat(userFromDb.get().getLogin()).isEqualTo(user.getLogin());
        assertThat(userFromDb.get().getId())
                .isNotNull()
                .isEqualTo(user.getId());
    }


}
