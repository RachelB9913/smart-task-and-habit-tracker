package com.example.demo.controller;

import com.example.demo.dto.UpdateHoursRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Habit;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private HabitRepository habitRepository;
   
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

    // GET /api/users/{id}
    // @GetMapping("/{id}")
    // public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
    //     User user = userRepository.findById(id)
    //         .orElseThrow(() -> new RuntimeException("User not found"));

    //     return ResponseEntity.ok(UserMapper.toDTO(user));
    // }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, @RequestParam Long userId) {
        if (!id.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your account");
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
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

    // @PutMapping("/update-hours")
    // public ResponseEntity<String> updateUserHours(@Valid @RequestBody UpdateHoursRequest request) {
    //     User user = userRepository.findById(request.getUserId())
    //         .orElseThrow(() -> new RuntimeException("User not found"));

    //     user.setStartHour(request.getStartHour());
    //     user.setEndHour(request.getEndHour());
    //     userRepository.save(user);

    //     return ResponseEntity.ok("Hours updated successfully");
    // }
    @PutMapping("/update-hours")
    public ResponseEntity<?> updateHours(@Valid @RequestBody UpdateHoursRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        if (!user.getId().equals(request.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: cannot update another user's hours");
        }

        user.setStartHour(request.getStartHour());
        user.setEndHour(request.getEndHour());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<Task>> getUserTasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskRepository.findByUserId(id));
    }

    @GetMapping("/{id}/habits")
    public ResponseEntity<List<Habit>> getUserHabits(@PathVariable Long id) {
        return ResponseEntity.ok(habitRepository.findByUserId(id));
    }

}
