// AuthController.java
package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userService.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Validation failed",
                "errors", Map.of("username", "Username already exists")
            ));
        }
        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Validation failed",
                "errors", Map.of("email", "Email already registered")
            ));
        }

        User user = userService.createUser(req.getUsername(), req.getEmail(), req.getPassword(),
                                           req.getStartHour(), req.getEndHour());

        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail()
        ));
    }

    // @PostMapping("/login")
    // public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthRequest loginData) {
    //     System.out.println("Login request received");
    //     User user = userRepository.findByUsername(loginData.getUsername());

    //     if (user == null || !passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
    //         return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    //     }

    //     Map<String, Object> response = new HashMap<>();
    //     response.put("username", user.getUsername());
    //     response.put("userId", user.getId());
    //     return ResponseEntity.ok(response);
    // }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthRequest loginData) {
        System.out.println("Login request received");

        try {
            System.out.println("Trying to authenticate...");
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginData.getUsername(), loginData.getPassword())
            );
            System.out.println("Authentication successful");
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // Load user
        Optional<User> userOpt = userService.findByEmail(loginData.getUsername());
        if (userOpt.isEmpty()) {
            User userByUsername = userService.findByUsername(loginData.getUsername());
            userOpt = userByUsername != null ? Optional.of(userByUsername) : Optional.empty();
        }
        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build Spring Security UserDetails object for JWT
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // or getUsername if that's your unique ID
                .password(user.getPassword())
                .authorities("USER")
                .build();

        // Generate JWT token
        String token = jwtService.generateToken(userDetails);

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("userId", user.getId());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}