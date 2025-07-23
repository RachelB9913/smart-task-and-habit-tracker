package com.example.demo.dto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.example.demo.validation.EndHourAfterStartHour;


@EndHourAfterStartHour 
public class UpdateHoursRequest {

    @NotNull
    private Long userId;

    @Min(0)
    @Max(23)
    private int startHour;

    @Min(0)
    @Max(23)
    private int endHour;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getStartHour() {
        return startHour;
    }

    public void setStartHour(int startHour) {
        this.startHour = startHour;
    }

    public int getEndHour() {
        return endHour;
    }

    public void setEndHour(int endHour) {
        this.endHour = endHour;
    }
}
