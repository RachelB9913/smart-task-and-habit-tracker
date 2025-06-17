package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // POST /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }   
}
