package com.example.demo.config;
import com.example.demo.repository.UserRepository;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        // Try to find by email first
        Optional<User> userOpt = userRepository.findByEmail(input);

        // If not found by email, try username
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(input);
        }

        User user = userOpt.orElseThrow(() ->
            new UsernameNotFoundException("User not found with email or username: " + input));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // Use email in the JWT token
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}
