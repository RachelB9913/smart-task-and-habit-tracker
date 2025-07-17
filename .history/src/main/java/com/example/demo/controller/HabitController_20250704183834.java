package com.example.demo.controller;

import com.example.demo.dto.HabitDTO;
import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.entity.User;
import com.example.demo.mapper.HabitMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/habits") // This must match what you're calling in Postman
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isOwner(Habit habit, Long userId) {
        return habit != null && habit.getUser() != null && habit.getUser().getId().equals(userId);
    }

    @PostMapping
    public ResponseEntity<?> createHabit(@Valid @RequestBody HabitDTO dto) {

        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        // Optional: compare dto.getUserId() with authenticated userId, if needed
        if (!isOwner(new Habit(), dto.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your habit");
        }

        Habit habit = new Habit();
        habit.setTitle(dto.getTitle());
        habit.setFrequency(dto.getFrequency());
        habit.setPreferredTime(dto.getPreferredTime());
        habit.setStatus(dto.getStatus());
        habit.setDescription(dto.getDescription());
        habit.setUser(optionalUser.get());

        Habit saved = habitRepository.save(habit);

        HabitDTO result = new HabitDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getFrequency(),
            saved.getPreferredTime(),
            saved.getStatus(),
            saved.getUser().getId(),
            saved.getDescription()
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HabitDTO>> getHabitsByUser(@PathVariable Long userId) {
        List<Habit> habits = habitRepository.findByUserId(userId);
        List<HabitDTO> dtos = habits.stream().map(habit -> {
            HabitDTO dto = new HabitDTO();
            dto.setId(habit.getId());
            dto.setTitle(habit.getTitle());
            dto.setFrequency(habit.getFrequency());
            dto.setPreferredTime(habit.getPreferredTime());
            dto.setStatus(habit.getStatus());
            dto.setUserId(habit.getUser().getId()); 

            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }   

    @PostMapping("/user/{userId}")
    public ResponseEntity<HabitDTO> addHabitForUser(@PathVariable Long userId, @RequestBody Habit habit) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        habit.setUser(user);
        Habit saved = habitRepository.save(habit);

        HabitDTO dto = new HabitDTO();
        dto.setId(saved.getId());
        dto.setTitle(saved.getTitle());
        dto.setFrequency(saved.getFrequency());
        dto.setPreferredTime(saved.getPreferredTime());
        dto.setStatus(saved.getStatus());
        dto.setUserId(saved.getUser().getId());

        return ResponseEntity.ok(dto);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<HabitDTO> getHabitById(@PathVariable Long id) {
    //     Habit habit = habitRepository.findById(id)
    //         .orElseThrow(() -> new RuntimeException("Habit not found"));
    //     HabitDTO dto = HabitMapper.toDto(habit);
    //     return ResponseEntity.ok(dto);
    // }
    @GetMapping("/{id}")
    public ResponseEntity<?> getHabit(@PathVariable Long id, @RequestParam Long userId) {
        Habit habit = habitRepository.findById(id).orElse(null);
        if (habit == null) return ResponseEntity.notFound().build();

        if (!isOwner(habit, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your habit");
        }

        return ResponseEntity.ok(habit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHabit(@PathVariable Long id, @RequestParam Long userId) {
        Habit habit = habitRepository.findById(id).orElse(null);
        if (habit == null) return ResponseEntity.notFound().build();

        if (!isOwner(habit, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your habit");
        }

        habitRepository.delete(habit);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHabit(@PathVariable Long id, @RequestBody Habit updatedHabit) {
        Habit existing = habitRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        if (!isOwner(existing, updatedHabit.getUser().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your habit");
        }

        existing.setTitle(updatedHabit.getTitle());
        existing.setDescription(updatedHabit.getDescription());
        existing.setFrequency(updatedHabit.getFrequency());
        existing.setPreferredTime(updatedHabit.getPreferredTime());

        return ResponseEntity.ok(habitRepository.save(existing));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<HabitDTO> updateHabitStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Habit> optionalTask = habitRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit habit = optionalTask.get();
        String status = payload.get("status");
        habit.setStatus(status);
        habitRepository.save(habit);

        return ResponseEntity.ok(HabitMapper.toDto(habit));
    }
}
