package com.example.demo.dto;

import java.time.LocalDateTime;

public class TaskDTO {
    private Long id; // Assuming you want to include an ID for the task
    private String title;
    private String description;
    private String priority;
    private String status;
    private LocalDateTime dueDate;
    private Long userId;
    private String scheduledTime;

    public TaskDTO() {}

    public TaskDTO(Long id, String title, String description, String priority, String status, LocalDateTime dueDate, Long userId, String scheduledTime) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.userId = userId;
        this.scheduledTime = scheduledTime;
    }


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime;}
}
