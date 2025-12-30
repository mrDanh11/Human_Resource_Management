package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ActivityListResponse {
    private List<ActivityResponse> activities;
    private long total;
    private int page;
    private int pageSize;
}
