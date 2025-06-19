package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/hello",
                    "/api/auth/**",
                    "/api/users",
                    "/api/habits/**",      // ✅ allow habits
                    "/api/tasks/**",        // ✅ allow tasks
                    "/api/users/*/habits",
                    "/api/users/*/tasks",
                    "/api/users/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(); // Optional for testing via Postman
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

