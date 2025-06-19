package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new habit using DTO
    @PostMapping
    public Habit createHabit(@RequestBody HabitDTO dto) {
        Habit habit = new Habit();
        habit.setName(dto.getTitle());
        habit.setFrequency(dto.getFrequency());
        habit.setProgress(dto.getProgress());

        // Link to user
        userRepository.findById(dto.getUserId()).ifPresent(habit::setUser);

        return habitRepository.save(habit);
    }

    // Get all habits for a user and return them as DTOs
    @GetMapping("/user/{userId}")
    public List<HabitDTO> getHabitsByUser(@PathVariable Long userId) {
        return habitRepository.findByUserId(userId).stream()
            .map(habit -> new HabitDTO(
                habit.getTitle(),
                habit.getFrequency(),
                habit.getProgress(),
                habit.getUser().getId(),
                habit.getDescription()
            )).collect(Collectors.toList());
    }

    @PutMapping("/{id}/progress")
    public Habit updateProgress(@PathVariable Long id) {
        Habit habit = habitRepository.findById(id).orElseThrow();
        habit.setProgress(habit.getProgress() + 1);
        return habitRepository.save(habit);
    }

    @DeleteMapping("/{id}")
    public void deleteHabit(@PathVariable Long id) {
        habitRepository.deleteById(id);
    }
}
