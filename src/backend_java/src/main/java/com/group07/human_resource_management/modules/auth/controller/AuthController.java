package com.group07.human_resource_management.modules.auth.controller;

import com.group07.human_resource_management.modules.auth.dto.request.LoginRequest;
import com.group07.human_resource_management.modules.auth.dto.response.LoginResponse;
import com.group07.human_resource_management.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        System.out.println("LOGIN CALLED");
        return authService.login(request);
    }
}
