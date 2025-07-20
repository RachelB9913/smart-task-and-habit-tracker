package com.example.demo.controller;

import com.example.demo.config.UserUtils;
import com.example.demo.dto.TaskDTO;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.mapper.TaskMapper;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public ResponseEntity<Task> createTask(@RequestBody TaskDTO dto) {
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

    @PostMapping("/user/{userId}")
    public ResponseEntity<TaskDTO> addTaskForUser(@PathVariable Long userId, @RequestBody Task task) {

        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        task.setUser(currentUser);
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

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        TaskDTO dto = TaskMapper.toDto(task);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUser(@PathVariable Long userId) {

        // Get the logged-in user
        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Compare userId to authenticated user ID
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).body(null);
        }
        
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

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteTaskById(@PathVariable Long id) {
    //     if (taskRepository.existsById(id)) {
    //         taskRepository.deleteById(id);
    //         return ResponseEntity.noContent().build();
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskById(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task task = optionalTask.get();

        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // @PatchMapping("/{id}/status")
    // public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
    //     Optional<Task> optionalTask = taskRepository.findById(id);
    //     if (optionalTask.isEmpty()) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     Task task = optionalTask.get();
    //     String status = payload.get("status");
    //     task.setStatus(status);
    //     taskRepository.save(task);

    //     return ResponseEntity.ok(TaskMapper.toDto(task));
    // }
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = optionalTask.get();

        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        String status = payload.get("status");
        task.setStatus(status);
        taskRepository.save(task);

        return ResponseEntity.ok(TaskMapper.toDto(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Optional<Task> existingOpt = taskRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task existing = existingOpt.get();

        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!existing.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setPriority(updatedTask.getPriority());
        existing.setStatus(updatedTask.getStatus());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setScheduledTime(updatedTask.getScheduledTime());

        taskRepository.save(existing);
        return ResponseEntity.ok(TaskMapper.toDto(existing));
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

        String email = UserUtils.getCurrentUsername();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        task.setScheduledTime(scheduledTime);
        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(TaskMapper.toDto(updated));
    }

}
