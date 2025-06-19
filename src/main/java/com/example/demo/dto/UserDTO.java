package com.example.demo.dto;
import java.util.List;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private List<Long> taskIds;
    private List<Long> habitIds;

    // constructors, getters, setters
    public UserDTO() {}
    public UserDTO(Long id, String username, String email, List<Long> taskIds, List<Long> habitIds) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.taskIds = taskIds;
        this.habitIds = habitIds;
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

}
