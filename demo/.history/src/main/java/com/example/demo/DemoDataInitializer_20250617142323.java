package com.example.demo;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DemoDataInitializer {

    @Bean
    CommandLineRunner run(UserRepository userRepo) {
        return args -> {
            boolean userExists = userRepo.findAll().stream()
                .anyMatch(u -> u.getEmail().equals("rachel@example.com"));

            if (!userExists) {
                User user = new User();
                user.setUsername("Rachel");
                user.setEmail("rachel@example.com");
                user.setPassword("1234");
                user.setCreatedAt(LocalDateTime.now());
                userRepo.save(user);

                System.out.println("✅ Test user saved to DB.");
            } else {
                System.out.println("ℹ️ User already exists, not adding again.");
            }
        };
    }

}