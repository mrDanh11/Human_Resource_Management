package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.RegistrationRequest;
import com.group07.human_resource_management.dto.response.ParticipationResponse;

import java.util.List;

public interface IParticipationService {
    ParticipationResponse registerActivity(Long employeeId, RegistrationRequest request);
    List<ParticipationResponse> getMyParticipations(Long employeeId);
    void unregisterActivity(Long employeeId, Long activityId);
}
