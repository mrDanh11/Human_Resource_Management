package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "point_transaction_history")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class PointTransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK employee_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer value;

    @Column(nullable = false)
    private String type; // earn, redeem, transfer, adjustment

    // actor_id → employee.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private Employee actor;

    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
