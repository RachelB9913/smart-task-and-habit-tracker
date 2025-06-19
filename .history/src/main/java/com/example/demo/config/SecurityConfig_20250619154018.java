package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

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
                    "/api/users/**",           // includes GET, DELETE, etc.
                    "/api/habits",
                    "/api/habits/**",          // for specific habit operations
                    "/api/tasks",
                    "/api/tasks/**"            // allow all task operations
                ).permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(); // Optional: allows Postman to authenticate easily
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
