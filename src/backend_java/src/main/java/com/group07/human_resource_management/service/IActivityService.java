package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateActivityRequest;
import com.group07.human_resource_management.dto.response.ActivityListResponse;
import com.group07.human_resource_management.dto.response.ActivityResponse;

public interface IActivityService {
    ActivityListResponse getAllActivities(int page, int pageSize, String status, String search);
    ActivityResponse getActivityById(Long id);
    ActivityResponse createActivity(Long employeeId, CreateActivityRequest request);
    void deleteActivity(Long id);
    ActivityResponse updateActivity(Long id, CreateActivityRequest request);
}
