package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "monthly_point_allocation_history",
    uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month"})
)
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class MonthlyPointAllocationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "execution_date", nullable = false)
    private LocalDateTime executionDate;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "total_employees_processed")
    private Integer totalEmployeesProcessed;

    @Column(name = "total_points_allocated")
    private Integer totalPointsAllocated;

    private String status;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
