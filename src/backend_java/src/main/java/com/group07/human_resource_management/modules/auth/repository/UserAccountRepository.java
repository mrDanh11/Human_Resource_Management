package com.group07.human_resource_management.modules.auth.repository;

import com.group07.human_resource_management.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount,Long> {
    boolean existsByUsername(String username);

    Optional<UserAccount> findByUsername(String username);

    boolean existsByEmployee_Id(Long employeeId);
}
