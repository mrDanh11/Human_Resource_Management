package com.group07.human_resource_management.modules.department.repository;

import com.group07.human_resource_management.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
}
