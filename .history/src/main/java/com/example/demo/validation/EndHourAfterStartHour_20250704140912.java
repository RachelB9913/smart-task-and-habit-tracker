package com.example.demo.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EndHourAfterStartHourValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface EndHourAfterStartHour {
    String message() default "End hour must be greater than start hour";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}