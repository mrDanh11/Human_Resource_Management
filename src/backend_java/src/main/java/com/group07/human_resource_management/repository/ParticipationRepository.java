package com.group07.human_resource_management.repository;

import com.group07.human_resource_management.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    boolean existsByEmployeeIdAndActivityId(Long employeeId, Long activityId);
    void deleteByActivityId(Long activityId);
}
