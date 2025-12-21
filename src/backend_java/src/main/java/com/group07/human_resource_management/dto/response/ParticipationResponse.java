package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ParticipationResponse {
    private Long employeeId;
    private Long activityId;
    private LocalDateTime registeredAt;
    private String status;
}
