package pl.edu.agh.marsexplorer.tests;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.agh.marsexplorer.model.domain.User;
import pl.edu.agh.marsexplorer.service.UserService;
import pl.edu.agh.marsexplorer.tests.base.IntegrationTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;


public final class UserIntegrationTest extends IntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    public void testNewUserIsPersistedWithCorrectId() {
        // given
        final String externalId = "id";
        final String name = "Kamil";
        // when
        userService.getSynchronizedUser(externalId, name);
        Optional<User> userFromDb = userRepository.findByFacebookId(externalId);

        // then
        assertThat(userFromDb.isPresent()).isTrue();
        assertThat(userFromDb.get().getFacebookId()).isEqualTo(externalId);
        assertThat(userFromDb.get().getId()).isNotNull();
    }

    @Test
    public void testExistingUserIsFetchedFromDb() {
        // given
        User givenUser = userRepository.save(new User("aaa", "Andrzej"));

        // when
        User fetchedUser = userService.getSynchronizedUser(givenUser.getFacebookId(), givenUser.getName());

        // then
        assertThat(fetchedUser.getId()).isNotBlank();
        assertThat(fetchedUser.getId()).isEqualTo(givenUser.getId());
    }


}
