package com.lkbird.service;

import java.util.List;
import java.util.Optional;

import com.lkbird.entity.Role;

public interface RoleService {

    List<Role> getAllRoles();

    Optional<Role> getRoleById(Long id);

    Optional<Role> getRoleByName(String name);

    Role createRole(Role role);

    Role updateRole(Role role);

    void deleteRole(Long id);
}