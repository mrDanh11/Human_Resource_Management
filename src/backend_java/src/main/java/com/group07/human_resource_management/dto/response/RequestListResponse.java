package com.group07.human_resource_management.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestListResponse {
    private Long id;
    private String employeeName;
    private String type;
    private String status;
    private LocalDateTime createdDate;
}
