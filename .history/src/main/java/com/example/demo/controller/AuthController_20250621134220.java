// AuthController.java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
// import com.example.demo.security.JwtService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // @PostMapping("/login")
    // public ResponseEntity<UserDTO> login(@RequestBody User loginData) {
    //     User user = userRepository.findByUsername(loginData.getUsername());
    //     if (user == null || !passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
    //         return ResponseEntity.status(401).build();
    //     }
    //     UserDTO userDTO = new UserDTO(user);
    //     return ResponseEntity.ok(userDTO);
    // }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginData) {
        User user = userRepository.findByUsername(loginData.getUsername());

        if (user == null || !passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // ✅ Return both username and userId
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("userId", user.getId());
        return ResponseEntity.ok(response);
    }
}