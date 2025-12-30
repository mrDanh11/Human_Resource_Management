package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ParticipationResponse {
    private Long employeeId;
    private Long activityId;
    private String activityName;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private String location;
    private String activityType;
    private String imageUrl;
    private String organizer;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Integer points;
    private String activityStatus;
    private LocalDateTime registeredAt;
    private String status;
}
