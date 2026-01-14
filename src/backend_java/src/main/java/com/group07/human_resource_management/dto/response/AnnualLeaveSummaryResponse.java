package com.group07.human_resource_management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnualLeaveSummaryResponse {
    private double totalAnnualLeave;
    private double usedAnnualLeave;
}