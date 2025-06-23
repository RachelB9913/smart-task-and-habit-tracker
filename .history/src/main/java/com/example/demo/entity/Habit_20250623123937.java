package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String frequency;   // DAILY or WEEKLY
    private String preferredTime;  // e.g., "08:00", "morning", "evening"
    private LocalDateTime createdAt = LocalDateTime.now();
    private int progress = 0; // Progress tracking, e.g., number of completions

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors, Getters, and Setters
    public Habit() {
    }
    public Habit(String title, String description, String frequency, String preferredTime, User user) {
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.preferredTime = preferredTime;
        this.user = user;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getFrequency() {
        return frequency;
    }
    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
    public String getPreferredTime() {
        return preferredTime;
    }
    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public int getProgress() {
        return progress;
    }
    public void setProgress(int progress) {
        this.progress = progress;
    }
}
