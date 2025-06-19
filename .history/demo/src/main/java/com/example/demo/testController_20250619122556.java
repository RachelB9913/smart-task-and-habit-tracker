package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping
    public String hello() {
        System.out.println("✅ /test endpoint hit");
        return "Hello from /test!";
    }
}
