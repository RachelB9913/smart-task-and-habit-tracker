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
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByEmail(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(usernameOrEmail);
        }

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // this must match what’s used to sign the JWT
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}

