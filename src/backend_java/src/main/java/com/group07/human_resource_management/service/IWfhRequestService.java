package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateWfhRequestDto;
import com.group07.human_resource_management.dto.request.ValidateWfhRequestDto;
import com.group07.human_resource_management.dto.response.WfhQuotaResponse;
import com.group07.human_resource_management.dto.response.WfhRequestResponse;
import com.group07.human_resource_management.dto.response.WfhValidationResponse;

import java.util.List;

public interface IWfhRequestService {
    
    WfhRequestResponse createWfhRequest(CreateWfhRequestDto request);
    
    WfhValidationResponse validateWfhRequest(ValidateWfhRequestDto request);
    
    WfhQuotaResponse getWfhQuota(Long employeeId);
    
    List<WfhRequestResponse> getEmployeeWfhRequests(Long employeeId, String status);
    
    WfhRequestResponse getWfhRequestById(Long requestId);
    
    void cancelWfhRequest(Long requestId);
}
