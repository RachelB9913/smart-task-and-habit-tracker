package com.example.demo.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.*;

import com.example.demo.dto.RegisterRequest;

public class EndHourAfterStartHourValidator implements ConstraintValidator<EndHourAfterStartHour, RegisterRequest> {
    @Override
    public boolean isValid(RegisterRequest value, ConstraintValidatorContext context) {
        if (value == null) return true; // skip validation if object is null
        return value.getEndHour() > value.getStartHour();
    }
}


