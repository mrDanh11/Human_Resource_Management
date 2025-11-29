package com.group07.human_resource_management.modules.role.repository;

import com.group07.human_resource_management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
