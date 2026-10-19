package com.lkbird.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lkbird.entity.Role;
import com.lkbird.exception.DuplicateResourceException;
import com.lkbird.exception.ResourceNotFoundException;
import com.lkbird.repository.RoleRepository;
import com.lkbird.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Role createRole(Role role) {
        String normalizedName = role.getName() == null ? "" : role.getName().trim();

        if (roleRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Role này đã tồn tại");
        }

        role.setName(normalizedName);
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Role role) {
        Role existingRole = roleRepository.findById(role.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Role không tồn tại"));

        String normalizedName = role.getName() == null ? "" : role.getName().trim();

        if (!existingRole.getId().equals(role.getId())
                && roleRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Role này đã tồn tại");
        }

        existingRole.setName(normalizedName);
        return roleRepository.save(existingRole);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role không tồn tại");
        }
        roleRepository.deleteById(id);
    }
}
