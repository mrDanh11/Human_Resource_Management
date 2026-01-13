package com.group07.human_resource_management.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestSearchCriteria {
    private String status;
    private String type;
    private String keyword;
    @Builder.Default
    private int page = 1;
    @Builder.Default
    private int size = 10;
}
