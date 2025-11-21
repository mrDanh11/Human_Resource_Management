package com.group07.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employees/1")
    public ResponseEntity<Map<String, Object>> getEmployee() {
        Map<String, Object> employee = new HashMap<>();
        employee.put("id", 1);
        employee.put("fullName", "Nguyễn Quản Trị");
        employee.put("email", "admin@company.com");
        employee.put("phone", "0901111111");
        employee.put("role", "Admin");
        employee.put("department", "Ban giám đốc");
        return ResponseEntity.ok(employee);
    }
}