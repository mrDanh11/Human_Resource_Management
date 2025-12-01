package com.group07.human_resource_management.modules.auth.service;

import com.group07.human_resource_management.common.service.PermissionService;
import com.group07.human_resource_management.common.utils.JwtUtil;
import com.group07.human_resource_management.entity.RefreshToken;
import com.group07.human_resource_management.modules.auth.dto.request.LoginRequest;
import com.group07.human_resource_management.modules.auth.dto.response.LoginResponse;
import com.group07.human_resource_management.modules.auth.dto.response.LogoutResponse;
import com.group07.human_resource_management.modules.auth.repository.RefreshTokenRepository;
import com.group07.human_resource_management.modules.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserAccountRepository userRepo;
    private final PermissionService permissionService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public LoginResponse login(LoginRequest req) {

        var user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        String role = user.getEmployee().getRole().getName();
        List<String> permissions = permissionService.getPermissionsForRole(role);

        String token = jwtUtil.generateToken(user, permissions);
        String refresh = jwtUtil.generateRefreshToken(user);

        Long userId = user.getEmployee().getId();

        // luu refresh Token vao db
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refresh)
                .deviceInfo("Unknown")
                .ipAddress("192.168.1.10")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .isRevoked(false)
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);

        return new LoginResponse(token, refresh, role, permissions, userId);
    }

    public LogoutResponse logout(String accessToken) {

        // validate token
        try {
            if (jwtUtil.isExpired(accessToken)) {
                throw new RuntimeException("Token expired");
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }

        // extract username
        String userName = jwtUtil.extractUsername(accessToken);
        var user = userRepo.findByUsername(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // delete all refresh tokens
        refreshTokenRepository.deleteAllByUserId(user.getId());

        return new LogoutResponse("Logout successful");
    }
}
