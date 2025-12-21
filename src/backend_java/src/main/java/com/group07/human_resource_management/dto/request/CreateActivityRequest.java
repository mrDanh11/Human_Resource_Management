package com.group07.human_resource_management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateActivityRequest {

    @NotBlank(message = "Activity name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotNull(message = "Registration start date is required")
    private LocalDateTime registrationStartDate;

    @NotNull(message = "Registration end date is required")
    private LocalDateTime registrationEndDate;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;

    private String location;
    private String activityType;
    private String imageUrl;
    private String organizer;
    private Integer points;
}
