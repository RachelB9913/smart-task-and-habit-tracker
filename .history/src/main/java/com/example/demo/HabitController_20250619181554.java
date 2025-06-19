package com.example.demo;

import com.example.demo.dto.HabitDTO;
import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
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
        habit.setId(dto.getId()); // Assuming id is optional and can be set
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
                habit.getId(),
                habit.getTitle(),
                habit.getFrequency(),
                habit.getProgress(),
                habit.getUser().getId(),
                habit.getDescription()
            )).collect(Collectors.toList());
    }

    @PostMapping("/users/{userId}/habits")
    public HabitDTO createHabitForUser(@PathVariable Long userId, @RequestBody Habit habit) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        habit.setUser(user);
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
}
