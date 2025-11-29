package com.group07.human_resource_management.modules.auth.service;

import com.group07.human_resource_management.common.service.PermissionService;
import com.group07.human_resource_management.common.utils.JwtUtil;
import com.group07.human_resource_management.entity.UserAccount;
import com.group07.human_resource_management.modules.auth.dto.request.LoginRequest;
import com.group07.human_resource_management.modules.auth.dto.response.LoginResponse;
import com.group07.human_resource_management.modules.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserAccountRepository userRepo;
    private final PermissionService permissionService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

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

        return new LoginResponse(token, refresh, role, permissions);
    }
}
