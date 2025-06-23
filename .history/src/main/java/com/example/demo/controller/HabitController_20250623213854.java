package com.example.demo.controller;

import com.example.demo.dto.HabitDTO;
import com.example.demo.dto.HabitScheduleDTO;
import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.example.demo.entity.User;
import com.example.demo.mapper.HabitMapper;

import java.util.List;
import java.util.Optional;
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
        habit.setId(dto.getId()); 
        habit.setTitle(dto.getTitle());
        habit.setFrequency(dto.getFrequency());
        habit.setPreferredTime(dto.getPreferredTime());
        habit.setProgress(dto.getProgress());
        habit.setDescription(dto.getDescription());

        userRepository.findById(dto.getUserId()).ifPresent(habit::setUser);

        Habit saved = habitRepository.save(habit);

        return new HabitDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getFrequency(),
            saved.getPreferredTime(),
            saved.getProgress(),
            saved.getUser().getId(),
            saved.getDescription()
        );
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
            dto.setProgress(habit.getProgress());
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
        dto.setProgress(saved.getProgress());
        dto.setUserId(saved.getUser().getId());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitDTO> getHabitById(@PathVariable Long id) {
        Habit habit = habitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Habit not found"));
        HabitDTO dto = HabitMapper.toDto(habit);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitById(@PathVariable Long id) {
        if (habitRepository.existsById(id)) {
            habitRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitDTO> updateHabit(@PathVariable Long id, @RequestBody Habit updatedHabit) {
        Optional<Habit> existingOpt = habitRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit existing = existingOpt.get();
        existing.setTitle(updatedHabit.getTitle());
        existing.setDescription(updatedHabit.getDescription());
        existing.setFrequency(updatedHabit.getFrequency());
        existing.setPreferredTime(updatedHabit.getPreferredTime());
        existing.setProgress(updatedHabit.getProgress());

        habitRepository.save(existing);
        return ResponseEntity.ok(HabitMapper.toDto(existing));
    }

    @PostMapping("/schedule")
    public ResponseEntity<String> saveHabitSchedule(@RequestBody List<HabitScheduleDTO> habitSchedules) {
        for (HabitScheduleDTO dto : habitSchedules) {
            System.out.println("📅 Habit Scheduled: Habit ID " + dto.getHabitId() + " on " + dto.getDay() + " at " + dto.getTime());
            // You can extend this to save the schedule in the database later
        }
        return ResponseEntity.ok("Habit schedule received!");
    }
}
