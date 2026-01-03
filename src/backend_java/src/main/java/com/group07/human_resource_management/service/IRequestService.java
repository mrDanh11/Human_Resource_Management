package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.response.RequestDetailReponse;

public interface IRequestService {
    RequestDetailReponse getRequestDetail(Long managerId, Long requestId);
}
