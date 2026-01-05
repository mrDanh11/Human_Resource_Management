package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WfhQuotaResponse {
    private Integer monthlyLimit;
    private Integer usedDays;
    private Integer remainingDays;
    private String currentMonth;
}
