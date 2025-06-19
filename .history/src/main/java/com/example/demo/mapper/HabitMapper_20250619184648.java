package com.example.demo.mapper;

import com.example.demo.dto.HabitDTO;
import com.example.demo.entity.Habit;

public class HabitMapper {
    public static HabitDTO toDTO(Habit habit) {
        HabitDTO dto = new HabitDTO();
        dto.setId(habit.getId());
        dto.setTitle(habit.getTitle());
        dto.setDescription(habit.getDescription());
        dto.setCreatedAt(habit.getCreatedAt());
        dto.setProgress(habit.getProgress());
        dto.setUserId(habit.getUser().getId());
        return dto;
    }

    public static Habit toEntity(HabitDTO dto, User user) {
        Habit habit = new Habit();
        habit.setId(dto.getId());
        habit.setTitle(dto.getTitle());
        habit.setDescription(dto.getDescription());
        habit.setCreatedAt(dto.getCreatedAt());
        habit.setProgress(dto.getProgress());
        habit.setUser(user);
        return habit;
    }
}
