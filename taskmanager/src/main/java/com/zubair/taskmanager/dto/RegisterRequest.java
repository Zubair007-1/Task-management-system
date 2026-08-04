package com.zubair.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is Required")
    private String name;

    @Email(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is Required")
    private String password;
}
