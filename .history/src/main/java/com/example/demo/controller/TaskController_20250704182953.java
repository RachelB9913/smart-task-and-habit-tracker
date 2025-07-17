package com.example.demo.controller;

import com.example.demo.dto.TaskDTO;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;

import jakarta.validation.Valid;

import com.example.demo.mapper.TaskMapper;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus());
        task.setScheduledTime(dto.getScheduledTime());

        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);

        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    private boolean isOwner(Task task, Long userId) {
        return task != null && task.getUser() != null && task.getUser().getId().equals(userId);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TaskDTO> addTaskForUser(@PathVariable Long userId, @RequestBody Task task) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        Task saved = taskRepository.save(task);

        TaskDTO dto = new TaskDTO();
        dto.setId(saved.getId());
        dto.setTitle(saved.getTitle());
        dto.setDescription(saved.getDescription());
        dto.setPriority(saved.getPriority());
        dto.setStatus(saved.getStatus());
        dto.setDueDate(saved.getDueDate());
        dto.setUserId(saved.getUser().getId());

        return ResponseEntity.ok(dto);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
    //     Task task = taskRepository.findById(id)
    //         .orElseThrow(() -> new RuntimeException("Task not found"));
    //     if (task == null) return ResponseEntity.notFound().build();
    //     if (!isOwner(task, id)) {
    //         return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    //     }
    //     TaskDTO dto = TaskMapper.toDto(task);
    //     return ResponseEntity.ok(dto);
    // }
    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(@PathVariable Long id, @RequestParam Long userId) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (!isOwner(task, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your task");
        }

        return ResponseEntity.ok(task);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUser(@PathVariable Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<TaskDTO> dtos = tasks.stream().map(task -> {
            TaskDTO dto = new TaskDTO();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setPriority(task.getPriority());
            dto.setStatus(task.getStatus());
            dto.setDueDate(task.getDueDate());
            dto.setUserId(task.getUser().getId()); // only include the user ID
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }   

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam Long userId) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (!isOwner(task, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your task");
        }

        taskRepository.delete(task);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = optionalTask.get();
        String status = payload.get("status");
        task.setStatus(status);
        taskRepository.save(task);

        return ResponseEntity.ok(TaskMapper.toDto(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        Task existing = taskRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        if (!isOwner(existing, taskDTO.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: not your task");
        }

        existing.setTitle(taskDTO.getTitle());
        existing.setDescription(taskDTO.getDescription());
        existing.setScheduledTime(taskDTO.getScheduledTime());
        existing.setStatus(taskDTO.getStatus());

        return ResponseEntity.ok(taskRepository.save(existing));
    }


    @PutMapping("/{id}/schedule")
    public ResponseEntity<TaskDTO> scheduleTask(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String scheduledTime = request.get("scheduledTime"); // e.g. "Monday-14"
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task task = optionalTask.get();
        task.setScheduledTime(scheduledTime);
        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(TaskMapper.toDto(updated));
    }
}
