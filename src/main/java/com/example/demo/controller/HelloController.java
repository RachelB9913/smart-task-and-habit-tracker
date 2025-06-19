package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    public HelloController() {
        System.out.println("✅ HelloController loaded!");
    }

    @GetMapping("/hello")
    public String sayHello() {
        System.out.println("✅ /hello endpoint called");
        return "Hello from Spring Boot!";
    }
}
