package com.example.demo.security;

import com.example.demo.security.JwtService;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String token;
        final String username;

        // Check if header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        token = authHeader.substring(7); // Remove "Bearer " prefix
        username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findByUsername(username);
            if (jwtService.isTokenValid(token, user)) {
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username, 
                    null,
                    authorities 
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }   
        } else {
            // If token is invalid or user not found, clear the context
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
