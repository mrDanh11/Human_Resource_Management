package com.group07.human_resource_management.repository;

import com.group07.human_resource_management.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface RequestRepository extends JpaRepository<Request,Long>, JpaSpecificationExecutor<Request> {
    @Query("SELECT r FROM Request r WHERE r.id = :requestId AND r.employee.manager.id = :managerId")
    Optional<Request> findRequestForManager(@Param("requestId") Long requestId, @Param("managerId") Long managerId);
    // Find all requests by employee
    List<Request> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    // Find requests by employee and type
    List<Request> findByEmployeeIdAndTypeOrderByCreatedAtDesc(Long employeeId, String type);

    // Find requests by employee and status
    List<Request> findByEmployeeIdAndStatusOrderByCreatedAtDesc(Long employeeId, String status);

    // Check if employee has overlapping requests in date range
    @Query("SELECT r FROM Request r WHERE r.employee.id = :employeeId " +
           "AND r.type IN ('leave', 'business_trip', 'wfh') " +
           "AND r.status IN ('pending', 'approved') " +
           "AND ((r.startTime <= :endTime AND r.endTime >= :startTime))")
    List<Request> findOverlappingRequests(
        @Param("employeeId") Long employeeId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // Count WFH requests for employee in a month
    @Query("SELECT COUNT(r) FROM Request r WHERE r.employee.id = :employeeId " +
           "AND r.type = 'wfh' " +
           "AND r.status = 'approved' " +
           "AND YEAR(r.startTime) = :year " +
           "AND MONTH(r.startTime) = :month")
    Long countApprovedWfhRequestsInMonth(
        @Param("employeeId") Long employeeId,
        @Param("year") int year,
        @Param("month") int month
    );

    // Find approved WFH requests for employee in a month
    @Query("SELECT r FROM Request r WHERE r.employee.id = :employeeId " +
           "AND r.type = 'wfh' " +
           "AND r.status = 'approved' " +
           "AND YEAR(r.startTime) = :year " +
           "AND MONTH(r.startTime) = :month")
    List<Request> findApprovedWfhRequestsInMonth(
        @Param("employeeId") Long employeeId,
        @Param("year") int year,
        @Param("month") int month
    );

    @Query("SELECT COUNT(r) > 0 FROM Request r WHERE r.employee.id = :employeeId " +
           "AND r.status IN ('pending', 'approved') " +
           "AND (:startTime < r.endTime AND :endTime > r.startTime)")
    boolean existsOverlappingRequest(@Param("employeeId") Long employeeId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);
}
