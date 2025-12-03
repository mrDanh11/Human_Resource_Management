package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "point")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // employee_id UNIQUE
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Column(name = "point_total")
    private Integer pointTotal;

    @Column(name = "last_update")
    private LocalDateTime lastUpdate;
}
