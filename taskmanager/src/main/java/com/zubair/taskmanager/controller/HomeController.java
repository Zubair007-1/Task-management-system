package com.zubair.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/hello")
    public String hello() {
        return "Welcome Mohammad Zubair! This is my first Spring Boot REST API.";
    }
    @GetMapping("/about")
    public String about() {
        return "Task Management System Backend - Version 1.0";
    }

    @GetMapping("/contact")
    public String contact() {
        return "Email: zubair@example.com";
    }

    @GetMapping("/version")
    public String version() {
        return "Version 1.0";
    }
}