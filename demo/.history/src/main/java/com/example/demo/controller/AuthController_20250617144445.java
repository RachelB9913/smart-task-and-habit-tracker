// AuthController.java
package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()) != null) {
            return "Username already exists!";
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmail(request.getUsername() + "@example.com"); // temp email

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return "Invalid credentials!";
        }

        return "Login successful!";
    }
}
