package com.group07.human_resource_management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApprovalHistoryRequest {

    @NotNull
    private Long requestId;

    @NotBlank
    private String status; // APPROVED | REJECTED

    private String note;
}