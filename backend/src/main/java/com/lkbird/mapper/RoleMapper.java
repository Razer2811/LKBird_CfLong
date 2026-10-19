package com.lkbird.mapper;

import org.springframework.stereotype.Component;

import com.lkbird.dto.request.RoleRequest;
import com.lkbird.dto.response.RoleResponse;
import com.lkbird.entity.Role;


@Component
public class RoleMapper {
    public Role toEntity(RoleRequest request) {
        Role role = new Role();
        role.setName(request.getName());
        return role;
    }

    public RoleResponse toResponse(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setName(role.getName());

        return response;
    }
}
