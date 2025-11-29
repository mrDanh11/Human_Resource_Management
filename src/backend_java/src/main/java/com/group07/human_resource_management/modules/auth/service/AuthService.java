package com.group07.human_resource_management.modules.auth.service;

import com.group07.human_resource_management.common.service.PermissionService;
import com.group07.human_resource_management.common.utils.JwtUtil;
import com.group07.human_resource_management.entity.UserAccount;
import com.group07.human_resource_management.modules.auth.dto.request.LoginRequest;
import com.group07.human_resource_management.modules.auth.dto.response.LoginResponse;
import com.group07.human_resource_management.modules.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PermissionService permissionService;

    @Override
    public LoginResponse login(LoginRequest req) {

        UserAccount account = userAccountRepository
                .findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(req.getPassword(), account.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Lấy role
        String role = account.getEmployee().getRole().getName();

        // Lấy permissions theo role
        List<String> permissions = permissionService.getPermissionsForRole(role);

        // Tạo Access Token
        String token = jwtUtil.generateToken(account, permissions);

        // Tạo Refresh Token
        String refreshToken = jwtUtil.generateRefreshToken(account);

        return new LoginResponse(token, refreshToken, role, permissions);
    }
}
