package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private Integer maxParticipants;
    private String location;
    private String activityType;
    private String imageUrl;
    private String organizer;
    private Integer points;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer currentParticipants;
    private boolean isDeleted;
}
