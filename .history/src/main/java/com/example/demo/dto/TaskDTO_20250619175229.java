package com.example.demo.dto;

import java.time.LocalDateTime;

public class TaskDTO {
    private String title;
    private String description;
    private String priority;
    private String status;
    private Long userId;

    public TaskDTO() {}

    public TaskDTO(String title, String description, String priority, String status, Long userId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.userId = userId;
    }


    // Getters and Setters

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
