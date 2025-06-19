package com.example.demo.dto;

public class TaskDTO {
    private String title;
    private String description;
    private String dueDate; // ISO string format (optional handling)
    private boolean completed;
    private Long userId;

    public TaskDTO() {}

    public TaskDTO(String title, String description, String dueDate, boolean completed, Long userId) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = completed;
        this.userId = userId;
    }

    // Getters and Setters

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
