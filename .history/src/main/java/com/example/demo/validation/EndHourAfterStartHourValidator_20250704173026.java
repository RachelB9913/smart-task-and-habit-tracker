package com.example.demo.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UpdateHoursRequest;

public class EndHourAfterStartHourValidator implements ConstraintValidator<EndHourAfterStartHour, Object> {
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        int startHour, endHour;

        if (value instanceof RegisterRequest request) {
            startHour = request.getStartHour();
            endHour = request.getEndHour();
        } else if (value instanceof UpdateHoursRequest request) {
            startHour = request.getStartHour();
            endHour = request.getEndHour();
        } else {
            return true; 
        }

        if (endHour <= startHour) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("End hour must be greater than start hour")
                .addPropertyNode("endHour")
                .addConstraintViolation();
            return false;
        }

        return true;
    }
}


