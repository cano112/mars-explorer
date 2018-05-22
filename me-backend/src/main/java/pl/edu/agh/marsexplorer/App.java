package pl.edu.agh.marsexplorer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.marsexplorer.model.User;
import pl.edu.agh.marsexplorer.repositories.UserRepository;

@SpringBootApplication
@RestController
public class App implements CommandLineRunner {

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String hello() {
        return "Hello";
    }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override public void run(String... args) throws Exception {

    }
}
