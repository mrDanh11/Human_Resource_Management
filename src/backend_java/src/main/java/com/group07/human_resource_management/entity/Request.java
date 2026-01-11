package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "request")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // employee_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    private String type; // wfh, leave, overtime, …

    private String attachment;

    private String status;

    private Double duration;

    @Column(name = "leave_mode")
    private String leaveMode; // DAY, HALF_DAY, SHORT_HOUR

    private String session; // MORNING, AFTERNOON

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
