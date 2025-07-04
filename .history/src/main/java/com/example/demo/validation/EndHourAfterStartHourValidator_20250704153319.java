package com.example.demo.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import com.example.demo.dto.RegisterRequest;

public class EndHourAfterStartHourValidator implements ConstraintValidator<EndHourAfterStartHour, RegisterRequest> {
    @Override
    public boolean isValid(RegisterRequest request, ConstraintValidatorContext context) {
        if (request.getEndHour() <= request.getStartHour()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("End hour must be greater than start hour")
                .addPropertyNode("endHour")
                .addConstraintViolation();
            return false;
        }
        return true;
    }
}


