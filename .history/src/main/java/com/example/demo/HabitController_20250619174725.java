package com.example.demo;

import com.example.demo.dto.HabitDTO;
import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.demo.entity.User;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/habits") // ✅ This must match what you're calling in Postman
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    public HabitController() {
        System.out.println("✅✅✅ HabitController has been loaded!"); 
    }

    @PostMapping
    public HabitDTO createHabit(@RequestBody HabitDTO dto) {
        System.out.println("✅ HabitController POST hit");

        Habit habit = new Habit();
        habit.setTitle(dto.getTitle());
        habit.setFrequency(dto.getFrequency());
        habit.setProgress(dto.getProgress());
        habit.setDescription(dto.getDescription());

        userRepository.findById(dto.getUserId()).ifPresent(habit::setUser);

        Habit saved = habitRepository.save(habit);

        return new HabitDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getFrequency(),
            saved.getProgress(),
            saved.getUser().getId(),
            saved.getDescription()
        );
    }

    @GetMapping("/user/{userId}")
    public List<HabitDTO> getHabitsByUser(@PathVariable Long userId) {
        System.out.println("✅ HabitController GET hit");
        return habitRepository.findByUserId(userId).stream()
            .map(habit -> new HabitDTO(
                habit.getTitle(),
                habit.getFrequency(),
                habit.getProgress(),
                habit.getUser().getId(),
                habit.getDescription()
            )).collect(Collectors.toList());
    }

    @PostMapping("/users/{userId}/habits")
    public ResponseEntity<Habit> createHabitForUser(@PathVariable Long userId, @RequestBody Habit habit) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        habit.setUser(user);  // Make sure the correct import: com.example.demo.entity.User
        Habit savedHabit = habitRepository.save(habit);
        return ResponseEntity.ok(savedHabit);
    }
}
