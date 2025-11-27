package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "point_to_money_history")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class PointToMoneyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK employee_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "point_requested", nullable = false)
    private Integer pointRequested;

    @Column(name = "money_received", nullable = false)
    private Double moneyReceived;

    private String status; // pending, approved, rejected, completed

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}
