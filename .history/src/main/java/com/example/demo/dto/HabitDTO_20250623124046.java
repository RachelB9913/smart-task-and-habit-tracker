package com.example.demo.dto;

public class HabitDTO {
    private Long id; // Optional, if you want to return the ID after creation
    private String title;
    private String frequency; // always String
    private String preferredTime;
    private int progress;
    private Long userId;
    private String description;

    public HabitDTO() {}

    public HabitDTO(Long id, String title, String frequency, String preferredTime, int progress, Long userId, String description) {
        this.id = id;
        this.title = title;
        this.frequency = frequency;
        this.preferredTime = preferredTime;
        this.progress = progress;
        this.userId = userId;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String name) { this.title = name; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
