package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateLeaveRequest;
import com.group07.human_resource_management.dto.request.RequestSearchCriteria;
import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.dto.response.RequestListResponse;
import org.springframework.data.domain.Page;

public interface IRequestService {
    RequestDetailReponse getRequestDetail(Long managerId, Long requestId);
    Page<RequestListResponse> getListRequest(Long managerId, RequestSearchCriteria criteria);
    void createLeaveRequest(Long employeeId, CreateLeaveRequest req);
    void cancelRequest(Long employeeId, Long requestId);
    Page<RequestListResponse> getMyRequests(Long employeeId, RequestSearchCriteria criteria);
    Long countAnnualLeave(Long employeeId);
}
