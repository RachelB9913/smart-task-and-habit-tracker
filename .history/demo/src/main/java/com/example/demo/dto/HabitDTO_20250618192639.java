package com.example.demo.dto;

public class HabitDTO {
    private String title;
    private String frequency;
    private int progress;
    private String description;
    private Long userId;

    public HabitDTO() {}

    public HabitDTO(String title, String frequency, int progress, Long userId, String description) {
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.progress = progress;
        this.userId = userId;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String name) { this.title = name; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
