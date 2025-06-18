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
        String identifier = loginData.getIdentifier();
        String password = loginData.getPassword();

        System.out.println("📩 Identifier = " + identifier); // for debug

        User user = userRepository.findByUsername(identifier);
        if (user == null) {
            System.out.println("🔍 Not a username, trying email...");
            user = userRepository.findByEmail(identifier);
        }

        if (user == null) {
            System.out.println("❌ No user found");
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("❌ Password mismatch");
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        System.out.println("✅ Login successful");
        return ResponseEntity.ok("Login successful");
    }
}

