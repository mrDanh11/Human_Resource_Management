package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.RegistrationRequest;
import com.group07.human_resource_management.dto.response.ParticipationResponse;

public interface IParticipationService {
    ParticipationResponse registerActivity(Long employeeId, RegistrationRequest request);
}
