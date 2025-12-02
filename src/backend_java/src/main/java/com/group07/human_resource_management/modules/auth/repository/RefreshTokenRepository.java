package com.group07.human_resource_management.modules.auth.repository;

import com.group07.human_resource_management.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Xoá tất cả refresh token theo user_id
    @Transactional
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteAllByUserId(Long userId);

    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser_Id(Long userId);

}
