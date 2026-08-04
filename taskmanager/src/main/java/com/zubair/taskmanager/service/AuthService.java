package com.zubair.taskmanager.service;

import com.zubair.taskmanager.dto.JwtResponse;
import com.zubair.taskmanager.dto.LoginRequest;
import com.zubair.taskmanager.dto.RegisterRequest;
import com.zubair.taskmanager.entity.User;
import com.zubair.taskmanager.repository.UserRepository;
import com.zubair.taskmanager.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository =userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtil=jwtUtil;

    }
    public String register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already exist");
        }
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        return "User registered Successfully";
    }

    public JwtResponse login(LoginRequest request) {

        System.out.println("===== LOGIN REQUEST =====");
        System.out.println("Email: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        System.out.println("User Found: " + user.getEmail());

        boolean match = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        System.out.println("Password Match: " + match);

        if (!match) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        System.out.println("Token Generated Successfully");

        return new JwtResponse(token);
    }
}
