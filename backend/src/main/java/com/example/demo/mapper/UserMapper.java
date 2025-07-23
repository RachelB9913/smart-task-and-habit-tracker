package com.example.demo.mapper;

import java.util.stream.Collectors;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Habit;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setTaskIds(user.getTasks().stream().map(Task::getId).collect(Collectors.toList()));
        dto.setHabitIds(user.getHabits().stream().map(Habit::getId).collect(Collectors.toList()));
        dto.setStartHour(user.getStartHour() == 0 ? 6 : user.getStartHour());
        dto.setEndHour(user.getEndHour() == 0 ? 23 : user.getEndHour());
        return dto;
    }

    public static User fromDTO(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setStartHour(dto.getStartHour());
        user.setEndHour(dto.getEndHour());
        return user;
    }
}