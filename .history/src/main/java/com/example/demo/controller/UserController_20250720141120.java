package com.example.demo.controller;

import com.example.demo.config.UserUtils;
import com.example.demo.dto.UpdateHoursRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Habit;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());

            dto.setTaskIds(user.getTasks().stream()
                .map(Task::getId)
                .collect(Collectors.toList()));

            dto.setHabitIds(user.getHabits().stream()
                .map(Habit::getId)
                .collect(Collectors.toList()));

            return dto;
        }).collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        String email = UserUtils.getCurrentUsername();  // Get current logged-in email

        // Get the user making the request
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Deny access if IDs don’t match
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(currentUser);
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }   

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            User updatedUser = userRepository.save(user);
            UserDTO dto = UserMapper.toDTO(updatedUser);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-hours")
    public ResponseEntity<String> updateUserHours(@RequestBody UpdateHoursRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStartHour(request.getStartHour());
        user.setEndHour(request.getEndHour());
        userRepository.save(user);

        return ResponseEntity.ok("Hours updated successfully");
    }

}
