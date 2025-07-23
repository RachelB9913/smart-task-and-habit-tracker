// AuthController.java
package backend.src.main.java.com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
// import com.example.demo.security.JwtService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Register request received");
        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStartHour(request.getStartHour());
        user.setEndHour(request.getEndHour());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
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
        Optional<User> userOpt = userRepository.findByEmail(loginData.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(loginData.getUsername());
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