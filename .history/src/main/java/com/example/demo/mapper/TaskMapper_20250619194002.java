package com.example.demo.mapper;

import com.example.demo.dto.TaskDTO;
import com.example.demo.entity.Task;

public class TaskMapper {
    public static TaskDTO toDto(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setUserId(task.getUser().getId());
        return dto;
    }

    public static Task fromDto(TaskDTO dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        return task;
    }
}
