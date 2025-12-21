package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.dto.request.LoginRequest;
import com.group07.human_resource_management.dto.request.RefreshRequest;
import com.group07.human_resource_management.dto.response.LoginResponse;
import com.group07.human_resource_management.dto.response.LogoutResponse;
import com.group07.human_resource_management.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(HttpServletRequest request){
        String header = request.getHeader("Authorization");

        if(header == null || !header.startsWith("Bearer ")){
            return ResponseEntity.status(401).body(new LogoutResponse("Missing token"));
        }

        String token = header.substring(7);

        try {
            authService.logout(token);
            return ResponseEntity.ok(new LogoutResponse("Logout successful"));
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(new LogoutResponse(e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public LoginResponse refresh(@RequestBody RefreshRequest req) {
        return authService.refresh(req);
    }
}
