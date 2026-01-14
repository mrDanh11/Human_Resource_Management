package com.group07.human_resource_management.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDetailReponse {
    private Long id;
    private String employeeName;
    private Long employeeId;
    private String type;
    private String description;
    private String status;
    private String attachment;
    private String leaveMode;
    private String session;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String managerNote;
    private String managerActionStatus;
    private LocalDateTime actionDate;
}
