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
                    
                    // Monthly Point permissions - ADMIN có FULL quyền
                    "monthly_point:view",      // Xem quy tắc và lịch sử
                    "monthly_point:manage",    // Tạo, sửa, xóa quy tắc
                    "monthly_point:allocate"   // Chạy job thủ công (CHỈ admin)
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
                    
                    // Monthly Point permissions - HR có thể xem và quản lý, NHƯNG KHÔNG chạy job
                    "monthly_point:view",      // Xem quy tắc và lịch sử
                    "monthly_point:manage"     // Tạo, sửa, xóa quy tắc
                    // KHÔNG có monthly_point:allocate
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
                    
                    // Monthly Point permissions - Manager CHỈ xem
                    "monthly_point:view"       // CHỈ xem, KHÔNG sửa
                    // KHÔNG có monthly_point:manage
                    // KHÔNG có monthly_point:allocate
            );

            default -> List.of(
                    // Employee (basic role) - CHỈ xem thông tin của chính mình
                    "employee:view",
                    "point:view"
                    // KHÔNG có bất kỳ monthly_point permission nào
            );
        };
    }
}