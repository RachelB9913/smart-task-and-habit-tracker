package com.example.demo.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.*;

public class EndHourAfterStartHourValidator implements ConstraintValidator<EndHourAfterStartHour, RegisterRequest> {
    @Override
    public boolean isValid(RegisterRequest value, ConstraintValidatorContext context) {
        if (value == null) return true; // skip validation if object is null
        return value.getEndHour() > value.getStartHour();
    }
}

@Documented
@Constraint(validatedBy = EndHourAfterStartHourValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface EndHourAfterStartHour {
    String message() default "End hour must be greater than start hour";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

