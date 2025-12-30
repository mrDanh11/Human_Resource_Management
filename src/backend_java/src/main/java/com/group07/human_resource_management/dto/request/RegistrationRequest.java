package com.group07.human_resource_management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotNull(message = "Activity ID is required")
    private Long activityId;
}
