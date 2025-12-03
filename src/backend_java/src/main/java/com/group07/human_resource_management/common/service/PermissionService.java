package com.group07.human_resource_management.common.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {

    public List<String> getPermissionsForRole(String role) {
        return switch (role.toLowerCase()) {
            case "admin" -> List.of(
                    "employee:create",
                    "employee:update",
                    "employee:delete",
                    "department:create",
                    "department:update",
                    "department:view",
                    "point:view",
                    "point:update"
            );

            case "hr" -> List.of(
                    "employee:update",
                    "employee:view",
                    "employee:create",
                    "employee:delete",
                    "department:view"
            );

            case "manager" -> List.of(
                    "employee:view",
                    "employee:create",
                    "employee:update",
                    "employee:delete",
                    "department:view"
            );

            default -> List.of("employee:view");
        };
    }
}
