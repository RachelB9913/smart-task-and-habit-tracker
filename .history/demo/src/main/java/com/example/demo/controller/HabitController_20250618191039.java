package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new habit
    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitRepository.save(habit);
    }

    // Get all habits for a user
    @GetMapping("/user/{userId}")
    public List<Habit> getHabitsByUser(@PathVariable Long userId) {
        return habitRepository.findByUserId(userId);
    }

    // Increment progress (simple example)
    @PutMapping("/{id}/progress")
    public Habit updateProgress(@PathVariable Long id) {
        Habit habit = habitRepository.findById(id).orElseThrow();
        habit.setProgress(habit.getProgress() + 1); // Add 1 to progress
        return habitRepository.save(habit);
    }

    // Delete habit
    @DeleteMapping("/{id}")
    public void deleteHabit(@PathVariable Long id) {
        habitRepository.deleteById(id);
    }
}
