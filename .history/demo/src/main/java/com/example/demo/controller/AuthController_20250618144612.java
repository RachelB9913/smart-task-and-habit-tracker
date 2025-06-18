// AuthController.java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
// import com.example.demo.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.AuthRequest;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest loginData) {
        throw new RuntimeException("🚨 I got the request");
    }
    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody AuthRequest loginData) {
    //     System.out.println("🧪 Login attempt:");
    //     System.out.println("    username: " + loginData.getUsername());
    //     System.out.println("    email: " + loginData.getEmail());
    //     System.out.println("    password: " + loginData.getPassword());

    //     User user = null;

    //     if (loginData.getUsername() != null && !loginData.getUsername().isEmpty()) {
    //         user = userRepository.findByUsername(loginData.getUsername());
    //     } else if (loginData.getEmail() != null && !loginData.getEmail().isEmpty()) {
    //         user = userRepository.findByEmail(loginData.getEmail());
    //     }

    //     if (user == null) {
    //         System.out.println("❌ User not found");
    //         return ResponseEntity.status(401).body("Invalid credentials");
    //     }

    //     boolean match = passwordEncoder.matches(loginData.getPassword(), user.getPassword());
    //     System.out.println("🔐 Password match: " + match);

    //     if (!match) {
    //         return ResponseEntity.status(401).body("Invalid credentials");
    //     }

    //     return ResponseEntity.ok("Login successful");
    // }
}

