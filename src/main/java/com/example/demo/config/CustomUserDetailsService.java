package com.example.demo.config;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;

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
        Optional<User> userOpt = userRepository.findByEmail(input);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(input);
        }

        User user = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("User not found with email or username: " + input));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // your token will carry email
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}

