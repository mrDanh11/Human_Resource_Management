package com.group07.human_resource_management.modules.auth.repository;

import com.group07.human_resource_management.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount,Long> {
    boolean existsByUsername(String username);

    @Query("""
        SELECT ua FROM UserAccount ua
        JOIN FETCH ua.employee e
        JOIN FETCH e.role r
        WHERE ua.username = :username
    """)
    Optional<UserAccount> findByUsername(String username);

    boolean existsByEmployee_Id(Long employeeId);
}
