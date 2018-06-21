package pl.edu.agh.marsexplorer.tests.base;

import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import pl.edu.agh.marsexplorer.repositories.UserRepository;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class, loader=AnnotationConfigContextLoader.class)
public abstract class IntegrationTest {

    @Autowired
    protected UserRepository userRepository;

    @Before
    public void setUp() {
        userRepository.deleteAll();
    }

    @After
    public void tearDown() {
        userRepository.deleteAll();
    }
}
