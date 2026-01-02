package com.group07.human_resource_management.common.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {

    public List<String> getPermissionsForRole(String role) {
        return switch (role.toLowerCase()) {
            case "admin" -> List.of(
                    // Employee permissions
                    "employee:create",
                    "employee:update",
                    "employee:delete",
                    "employee:list",
                    "employee:view",
                    "employee:statistics",

                    // Department permissions
                    "department:create",
                    "department:update",
                    "department:view",

                    // Point permissions
                    "point:view",
                    "point:update",
                    "point:list",
                    
                    // Monthly Point permissions
                    "monthly-point:view",
                    "monthly-point:create",
                    "monthly-point:update",
                    "monthly-point:delete",
                    "monthly-point:allocate",
                    "monthly-point:history",

                    //Participation
                    "participate:list",
                    "participate:view",
                    "participate:update",
                    "participate:attendance"
            );

            case "hr" -> List.of(
                    // Employee permissions
                    "employee:update",
                    "employee:view",
                    "employee:create",
                    "employee:delete",
                    "employee:statistics",
                    "employee:list",

                    // Department permissions
                    "department:view",

                    // Point permissions
                    "point:view",
                    "point:update",
                    "point:list",
                    
                    // Monthly Point permissions
                    "monthly-point:view",
                    "monthly-point:create",
                    "monthly-point:update",
                    "monthly-point:delete",
                    "monthly-point:allocate",
                    "monthly-point:history",

                    //Participation
                    "participate:list",
                    "participate:view",
                    "participate:update",
                    "participate:attendance"
            );

            case "manager" -> List.of(
                    // Employee permissions
                    "employee:view",
                    "employee:create",
                    "employee:update",
                    "employee:delete",
                    "employee:list",

                    // Department permissions
                    "department:view",

                    // Point permissions
                    "point:view",
                    "point:update",
                    "point:list",
                    
                    // Monthly Point permissions
                    "monthly-point:view",
                    "monthly-point:history",

                    //Participation
                    "participate:list",
                    "participate:view",
                    "participate:update",
                    "participate:attendance"
            );

            default -> List.of(
                    // Employee permissions
                    "employee:view",
                    "employee:update",
                    
                    // Point permissions
                    "point:view",
                    
                    // Monthly Point permissions
                    "monthly-point:view",

                    //Participation
                    "participate:list",
                    "participate:view"
            );
        };
    }
}