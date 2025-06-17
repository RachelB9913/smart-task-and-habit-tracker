// AuthController.java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
// import com.example.demo.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        return ResponseEntity.ok("Login successful");
    }
}
