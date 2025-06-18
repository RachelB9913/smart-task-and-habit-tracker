package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @PostMapping("/ping")
    public String ping(@RequestBody Map<String, String> data) {
        System.out.println("🚨 Test endpoint hit with data: " + data);
        return "pong";
    }
}