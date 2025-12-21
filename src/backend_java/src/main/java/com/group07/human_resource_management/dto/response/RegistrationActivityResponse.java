package com.group07.human_resource_management.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationActivityResponse {
    private Long employeeId;
    private Long activityId;
    private LocalDateTime registrationDate;
    private String status;
}
