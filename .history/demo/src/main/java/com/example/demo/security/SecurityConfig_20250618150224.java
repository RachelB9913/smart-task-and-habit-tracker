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
                    "/ping",             // for GET ping test
                    "/api/test/**",      // for POST test endpoint
                    "/api/auth/**"       // for register/login
                ).permitAll()
                .anyRequest().authenticated() // anything else needs auth (e.g. JWT later)
            );
        return http.build();
    }
}
