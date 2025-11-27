package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "participation",
        uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "activity_id"})
)
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    // FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "register_date")
    private LocalDateTime registerDate;

    @Column(name = "cancel_date")
    private LocalDateTime cancelDate;

    private String status;

    private String result;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
