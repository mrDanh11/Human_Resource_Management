package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.dto.request.ApprovalHistoryRequest;
import com.group07.human_resource_management.dto.response.ApprovalHistoryResponse; 
import com.group07.human_resource_management.service.IApprovalHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;  
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.group07.human_resource_management.config.CustomUserDetails;

@RestController
@RequestMapping("/api/v1/manager/approval")
@RequiredArgsConstructor
public class ApprovalHistoryController {

    private final IApprovalHistoryService approvalHistoryService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApprovalHistoryResponse> approve(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody @Valid ApprovalHistoryRequest dto
    ) {
        ApprovalHistoryResponse response = approvalHistoryService.approveRequest(user.getEmployeeId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
