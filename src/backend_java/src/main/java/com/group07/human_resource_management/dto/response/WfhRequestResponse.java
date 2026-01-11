package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class WfhRequestResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String attachment;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
