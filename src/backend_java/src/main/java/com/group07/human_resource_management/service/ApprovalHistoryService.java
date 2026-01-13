package com.group07.human_resource_management.service;
import com.group07.human_resource_management.dto.request.ApprovalHistoryRequest;
import com.group07.human_resource_management.dto.response.ApprovalHistoryResponse;
import com.group07.human_resource_management.entity.ApprovalHistory;
import com.group07.human_resource_management.entity.Request;
import com.group07.human_resource_management.entity.Employee;
import com.group07.human_resource_management.repository.ApprovalHistoryRepository;
import com.group07.human_resource_management.repository.RequestRepository;
import com.group07.human_resource_management.service.IApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprovalHistoryService implements IApprovalHistoryService {

    private final ApprovalHistoryRepository approvalRepo;
    private final RequestRepository requestRepo;

    @Override
    public ApprovalHistoryResponse approveRequest(Long approverId, ApprovalHistoryRequest dto) {

        Request request = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Employee approver = Employee.builder().id(approverId).build();

        // update request status
        request.setStatus(dto.getStatus());
        requestRepo.save(request);

        ApprovalHistory history = approvalRepo.save(
                ApprovalHistory.builder()
                        .request(request)
                        .approver(approver)
                        .status(dto.getStatus().toLowerCase())
                        .note(dto.getNote())
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return ApprovalHistoryResponse.builder()
                .requestId(dto.getRequestId())
                .approverId(approverId)
                .status(history.getStatus())
                .note(history.getNote())
                .build();
    }
}
