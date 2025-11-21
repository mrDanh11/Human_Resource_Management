package com.group07.human_resource_management.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HelloController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        // Console log như bạn yêu cầu
        System.out.println("Hello World");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello World from Human Resource Management API!");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<Map<String, Object>> helloWithName(@PathVariable String name) {
        // Console log với tên
        System.out.println("Hello World - Request from: " + name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello " + name + "! Welcome to HR Management System");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/hello")
    public ResponseEntity<Map<String, Object>> helloPost(@RequestBody(required = false) Map<String, String> request) {
        String name = "Anonymous";
        if (request != null && request.containsKey("name")) {
            name = request.get("name");
        }
        
        // Console log
        System.out.println("Hello World - POST request from: " + name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello " + name + "! Your POST request was received successfully");
        response.put("status", "success");
        response.put("receivedData", request);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
