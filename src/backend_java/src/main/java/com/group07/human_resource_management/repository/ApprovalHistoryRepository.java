package com.group07.human_resource_management.repository;

import com.group07.human_resource_management.entity.ApprovalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApprovalHistoryRepository extends JpaRepository<ApprovalHistory,Long> {
    Optional<ApprovalHistory> findByRequestId(Long requestId);
}
