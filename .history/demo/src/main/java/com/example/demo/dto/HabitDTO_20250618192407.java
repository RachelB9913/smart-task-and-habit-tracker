package com.example.demo.dto;

public class HabitDTO {
    private String name;
    private String frequency;
    private int progress;
    private String description;
    private Long userId;

    public HabitDTO() {}

    public HabitDTO(String name, String frequency, int progress, Long userId) {
        this.name = name;
        this.frequency = frequency;
        this.progress = progress;
        this.userId = userId;
    }

    // Getters and Setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
