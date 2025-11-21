package com.group07.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // Demo users - trong thực tế sẽ query từ database
        Map<String, Object> user = authenticateUser(email, password);
        
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            response.put("token", "demo-jwt-token-" + email.split("@")[0]);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Tên đăng nhập hoặc mật khẩu không đúng");
            return ResponseEntity.status(401).body(response);
        }
    }

    private Map<String, Object> authenticateUser(String email, String password) {
        // Demo authentication data
        Map<String, Map<String, Object>> demoUsers = new HashMap<>();
        
        // Admin user
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", 1);
        admin.put("email", "admin@company.com");
        admin.put("fullName", "Nguyễn Quản Trị");
        admin.put("role", "Admin");
        admin.put("department", "Ban giám đốc");
        admin.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("admin@company.com:admin123", admin);

        // HR user
        Map<String, Object> hr = new HashMap<>();
        hr.put("id", 2);
        hr.put("email", "hr@company.com");
        hr.put("fullName", "Trần Nhân Sự");
        hr.put("role", "HR");
        hr.put("department", "Nhân sự");
        hr.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("hr@company.com:hr123", hr);

        // Manager user
        Map<String, Object> manager = new HashMap<>();
        manager.put("id", 3);
        manager.put("email", "manager@company.com");
        manager.put("fullName", "Lê Quản Lý");
        manager.put("role", "Manager");
        manager.put("department", "Công nghệ thông tin");
        manager.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("manager@company.com:manager123", manager);

        // Employee user
        Map<String, Object> employee = new HashMap<>();
        employee.put("id", 4);
        employee.put("email", "employee@company.com");
        employee.put("fullName", "Nguyễn Nhân Viên");
        employee.put("role", "Employee");
        employee.put("department", "Công nghệ thông tin");
        employee.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("employee@company.com:employee123", employee);

        // Thêm tài khoản test mới
        // Sales Manager
        Map<String, Object> salesManager = new HashMap<>();
        salesManager.put("id", 5);
        salesManager.put("email", "sales@company.com");
        salesManager.put("fullName", "Phạm Thu Hương");
        salesManager.put("role", "Manager");
        salesManager.put("department", "Kinh doanh");
        salesManager.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("sales@company.com:sales123", salesManager);

        // Accountant
        Map<String, Object> accountant = new HashMap<>();
        accountant.put("id", 6);
        accountant.put("email", "accounting@company.com");
        accountant.put("fullName", "Vũ Minh Hải");
        accountant.put("role", "Employee");
        accountant.put("department", "Kế toán");
        accountant.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("accounting@company.com:acc123", accountant);

        // Marketing Employee
        Map<String, Object> marketing = new HashMap<>();
        marketing.put("id", 7);
        marketing.put("email", "marketing@company.com");
        marketing.put("fullName", "Lê Thị Mai");
        marketing.put("role", "Employee");
        marketing.put("department", "Marketing");
        marketing.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("marketing@company.com:marketing123", marketing);

        // Team Leader
        Map<String, Object> teamLeader = new HashMap<>();
        teamLeader.put("id", 8);
        teamLeader.put("email", "team.leader@company.com");
        teamLeader.put("fullName", "Hoàng Văn Nam");
        teamLeader.put("role", "Team Leader");
        teamLeader.put("department", "Công nghệ thông tin");
        teamLeader.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("team.leader@company.com:leader123", teamLeader);

        // Intern
        Map<String, Object> intern = new HashMap<>();
        intern.put("id", 9);
        intern.put("email", "intern@company.com");
        intern.put("fullName", "Đỗ Thị Lan");
        intern.put("role", "Intern");
        intern.put("department", "Công nghệ thông tin");
        intern.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("intern@company.com:intern123", intern);

        // Customer Service
        Map<String, Object> customerService = new HashMap<>();
        customerService.put("id", 10);
        customerService.put("email", "cs@company.com");
        customerService.put("fullName", "Nguyễn Thành Đạt");
        customerService.put("role", "Employee");
        customerService.put("department", "Chăm sóc khách hàng");
        customerService.put("avatar", "/api/placeholder/100/100");
        demoUsers.put("cs@company.com:cs123", customerService);

        String key = email + ":" + password;
        return demoUsers.get(key);
    }
}