package com.group07.human_resource_management.common.service;

import com.group07.human_resource_management.modules.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {
    private final UserAccountRepository repo;
    private final PermissionService permissionService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        var user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = user.getEmployee().getRole().getName();

        // lay permission theo role
        List<String> permissions = permissionService.getPermissionsForRole(role);

        return User.withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(
                        permissions.stream().map(p -> p).toArray(String[]::new)
                )
                .build();
    }

}
