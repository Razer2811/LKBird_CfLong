package com.lkbird.service;

import java.util.List;
import java.util.Optional;

import com.lkbird.dto.request.UserRegisterRequest;
import com.lkbird.dto.request.UserRequest;
import com.lkbird.entity.User;

public interface UserService {

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    User createUser(UserRequest userrequest);

    User updateUser(User user, Long roleId);

    void deleteUser(Long id);

    User registerUser(UserRegisterRequest request);
}
