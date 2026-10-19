package com.lkbird.mapper;

import org.springframework.stereotype.Component;

import com.lkbird.dto.request.UserRegisterRequest;
import com.lkbird.dto.request.UserRequest;
import com.lkbird.dto.request.UserUpdateRequest;
import com.lkbird.dto.response.UserResponse;
import com.lkbird.entity.User;

@Component
public class UserMapper {
    public User toEntity(UserRegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return user;
    }

    public User toEntity(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return user;
    }

    public User toEntity(UserUpdateRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return user;
    }

    public UserResponse toResponse(User user){
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        if (user.getRole() != null) {
            response.setRoleId(user.getRole().getId());
        }
        return response;
    }
}
