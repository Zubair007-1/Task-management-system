package com.zubair.taskmanager.service;

import com.zubair.taskmanager.dto.RegisterRequest;
import com.zubair.taskmanager.entity.User;

public interface UserService {
    User register(RegisterRequest request);
}
