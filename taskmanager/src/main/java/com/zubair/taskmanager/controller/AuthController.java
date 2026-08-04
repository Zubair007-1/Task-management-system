package com.zubair.taskmanager.controller;

import com.zubair.taskmanager.dto.JwtResponse;
import com.zubair.taskmanager.dto.LoginRequest;
import com.zubair.taskmanager.dto.RegisterRequest;
import com.zubair.taskmanager.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){

        this.authService= authService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request){

        return authService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody LoginRequest request){
        return authService.login(request);
    }

}
