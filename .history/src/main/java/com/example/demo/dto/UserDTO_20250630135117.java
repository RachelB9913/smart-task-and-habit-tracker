package com.example.demo.dto;
import java.util.List;

import com.example.demo.entity.User;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private List<Long> taskIds;
    private List<Long> habitIds;
    private int startHour;
    private int endHour;

    // constructors, getters, setters
    public UserDTO() {}
    public UserDTO(Long id, String username, String email, List<Long> taskIds, List<Long> habitIds, int startHour, int endHour) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.taskIds = taskIds;
        this.habitIds = habitIds;
        this.startHour = startHour;
        this.endHour = endHour;
    }

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.taskIds = user.getTasks() != null ? user.getTasks().stream().map(task -> task.getId()).toList() : List.of();
        this.habitIds = user.getHabits() != null ? user.getHabits().stream().map(habit -> habit.getId()).toList() : List.of();
        this.startHour = user.getStartHour();
        this.endHour = user.getEndHour();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Long> getTaskIds() { return taskIds; }
    public void setTaskIds(List<Long> taskIds) { this.taskIds = taskIds; }

    public List<Long> getHabitIds() { return habitIds; }
    public void setHabitIds(List<Long> habitIds) { this.habitIds = habitIds; }

    public int getStartHour() { return startHour; }
    public void setStartHour(int startHour) { this.startHour = startHour; }

    public int getEndHour() { return endHour; }
    public void setEndHour(int endHour) { this.endHour = endHour; } 

}
