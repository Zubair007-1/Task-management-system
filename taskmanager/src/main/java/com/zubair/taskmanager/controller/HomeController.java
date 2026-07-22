package com.zubair.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/hello")
    public String hello() {
        return "Welcome Mohammad Zubair! This is my first Spring Boot REST API.";
    }
}