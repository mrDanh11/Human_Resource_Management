package com.group07.human_resource_management.service;
import com.group07.human_resource_management.dto.request.ApprovalHistoryRequest;
import com.group07.human_resource_management.dto.response.ApprovalHistoryResponse;
import com.group07.human_resource_management.entity.Employee;

public interface IApprovalHistoryService {
    ApprovalHistoryResponse approveRequest(
        Long approverId,
        ApprovalHistoryRequest dto
    );
}
