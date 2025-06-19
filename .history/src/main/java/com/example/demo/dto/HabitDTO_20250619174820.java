package com.example.demo.dto;

public class HabitDTO {
    private String title;
    private String frequency; // always String
    private int progress;
    private Long userId;
    private String description;

    public HabitDTO() {}

    public HabitDTO(String title, String frequency, int progress, Long userId, String description) {
        this.title = title;
        this.frequency = frequency;
        this.progress = progress;
        this.userId = userId;
        this.description = description;
    }

    // Getters and Setters
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }

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
