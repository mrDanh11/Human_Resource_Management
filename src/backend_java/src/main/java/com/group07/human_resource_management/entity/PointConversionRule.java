package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "point_conversion_rules")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class PointConversionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "point_value", nullable = false)
    private Integer pointValue;

    @Column(name = "money_value", nullable = false)
    private Double moneyValue;

    // updated_by → employee.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Employee updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;
}
