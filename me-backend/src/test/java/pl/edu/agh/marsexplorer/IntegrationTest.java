package pl.edu.agh.marsexplorer;

import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class, loader=AnnotationConfigContextLoader.class)
public abstract class IntegrationTest {

    @Before
    public abstract void setUp();

    @After
    public abstract void tearDown();
}
