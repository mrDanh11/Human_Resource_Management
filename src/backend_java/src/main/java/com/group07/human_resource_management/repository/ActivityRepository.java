package com.group07.human_resource_management.repository;

import com.group07.human_resource_management.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity,Long> {
}
