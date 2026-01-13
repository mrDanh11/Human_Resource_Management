package com.group07.human_resource_management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistoryResponse {
    private Long requestId;
    private Long approverId;
    private String status;
    private String note;
}
