package com.group07.human_resource_management.modules.employee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAccountResponse {
    private Long id;
    private Long employeeId;
    private String username;      // = email
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
