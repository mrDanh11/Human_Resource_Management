package com.group07.human_resource_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullname;

    @Column(nullable = false, unique = true, length = 12)
    private String cccd;

    @Column(name = "tax_code", unique = true, length = 13)
    private String taxCode;

    private String phone;
    private String address;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "join_date")
    private LocalDate joinDate;

    private String status;

    private LocalDate birthday;

    private String gender;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // FK role
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    // FK department
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @Column(name = "annual_leave_balance")
    private Double annualLeaveBalance; // Default 12.0

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
