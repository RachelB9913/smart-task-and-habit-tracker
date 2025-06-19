package com.example.demo.mapper;

import com.example.demo.dto.HabitDTO;
import com.example.demo.entity.Habit;

public class HabitMapper {
    public static HabitDTO toDto(Habit habit) {
        HabitDTO dto = new HabitDTO();
        dto.setTitle(habit.getTitle());
        dto.setFrequency(habit.getFrequency());
        dto.setProgress(habit.getProgress());
        dto.setDescription(habit.getDescription());
        dto.setUserId(habit.getUser().getId());
        return dto;
    }

    public static Habit fromDto(HabitDTO dto) {
        Habit habit = new Habit();
        habit.setTitle(dto.getTitle());
        habit.setFrequency(dto.getFrequency());
        habit.setProgress(dto.getProgress());
        habit.setDescription(dto.getDescription());
        // ⚠️ As above, user must be set externally
        return habit;
    }
}
