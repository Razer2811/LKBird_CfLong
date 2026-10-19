package com.lkbird.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lkbird.dto.request.UserRegisterRequest;
import com.lkbird.dto.request.UserRequest;
import com.lkbird.entity.Role;
import com.lkbird.entity.User;
import com.lkbird.exception.DuplicateResourceException;
import com.lkbird.exception.ResourceNotFoundException;
import com.lkbird.mapper.UserMapper;
import com.lkbird.repository.UserRepository;
import com.lkbird.service.RoleService;
import com.lkbird.service.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleService roleService, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User createUser(UserRequest userrequest) {
        if (userRepository.existsByUsername(userrequest.getUsername())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(userrequest.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        Optional<Role> role = roleService.getRoleById(userrequest.getRoleId());
        if (role.isEmpty()) {
            throw new ResourceNotFoundException("Role không tồn tại");
        }

        User user = userMapper.toEntity(userrequest);
        user.setRole(role.get());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user, Long roleId) {
        Optional<User> existingUser = userRepository.findById(user.getId());
        if (existingUser.isEmpty()) {
            throw new ResourceNotFoundException("Người dùng không tồn tại");
        }

        User currentUser = existingUser.get();

        if (!currentUser.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }

        if (!currentUser.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        Optional<Role> role = roleService.getRoleById(roleId);
        if (role.isEmpty()) {
            throw new ResourceNotFoundException("Role không tồn tại");
        }

        User updatedUser = existingUser.get();
        updatedUser.setUsername(user.getUsername());
        updatedUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            updatedUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        updatedUser.setRole(role.get());

        return userRepository.save(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
            throw new ResourceNotFoundException("Người dùng không tồn tại");
        }

        userRepository.deleteById(id);
    }

    @Override
    public User registerUser(UserRegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu đăng ký không được để trống");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        Role role = roleService.getRoleByName("USER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("USER");
                    return roleService.createRole(newRole);
                });

        User user = userMapper.toEntity(request);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }

}
