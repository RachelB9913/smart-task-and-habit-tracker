package com.example.demo.controller;

import com.example.demo.dto.TaskDTO;
import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.demo.entity.User;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @GetMapping("/user/{userId}")
    public List<TaskDTO> getTasksByUser(@PathVariable Long userId) {
        System.out.println("✅ TaskController GET hit");
        return taskRepository.findByUserId(userId).stream()
            .map(task -> new TaskDTO(
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted(),
                task.getUser().getId()
            )).collect(Collectors.toList());
    }

    @GetMapping("/users/{userId}/tasks")
    public ResponseEntity<List<Task>> getTasksForUser(@PathVariable Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping("/users/{userId}/tasks")
    public ResponseEntity<Task> createTaskForUser(@PathVariable Long userId, @RequestBody Task task) {
        User user = (User) userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    
}
