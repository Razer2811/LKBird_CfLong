package com.lkbird.controller;

import org.springframework.web.bind.annotation.RestController;

import com.lkbird.dto.request.RoleRequest;
import com.lkbird.dto.response.RoleResponse;
import com.lkbird.entity.Role;
import com.lkbird.mapper.RoleMapper;
import com.lkbird.service.RoleService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleMapper roleMapper;
    private final RoleService roleService;

    public RoleController(RoleService roleService, RoleMapper roleMapper) {
        this.roleService = roleService;
        this.roleMapper = roleMapper;
    }

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();

        List<RoleResponse> responses = new ArrayList<>();

        for (Role role : roles) {
            RoleResponse response = roleMapper.toResponse(role);
            responses.add(response);
        }

        return responses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Long id) {
        Optional<Role> role = roleService.getRoleById(id);

        if (role.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        RoleResponse response = roleMapper.toResponse(role.get());
        return ResponseEntity.ok(response);

    }

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody RoleRequest roleRequest) {

        Role role = roleMapper.toEntity(roleRequest);

        Role savedRole = roleService.createRole(role);

        RoleResponse response = roleMapper.toResponse(savedRole);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Long id, 
            @Valid @RequestBody RoleRequest roleRequest) {

        Optional<Role> existingRole = roleService.getRoleById(id);

        if (existingRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Role updatedRole = existingRole.get();
        updatedRole.setName(roleRequest.getName());
        Role savedRole = roleService.updateRole(updatedRole);
        
        RoleResponse response = roleMapper.toResponse(savedRole);

        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {

        Optional<Role> existingRole = roleService.getRoleById(id);

        if (existingRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}