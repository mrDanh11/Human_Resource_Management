package com.group07.human_resource_management.repository;

import com.group07.human_resource_management.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request,Long> {
    @Query("SELECT r FROM Request r WHERE r.id = :requestId AND r.employee.manager.id = :managerId")
    Optional<Request> findRequestForManager(@Param("requestId") Long requestId, @Param("managerId") Long managerId);
}
