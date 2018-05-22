package pl.edu.agh.marsexplorer;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan("pl.edu.agh.marsexplorer")
@EnableTransactionManagement
@PropertySource("application.properties")
public class TestConfig { }
