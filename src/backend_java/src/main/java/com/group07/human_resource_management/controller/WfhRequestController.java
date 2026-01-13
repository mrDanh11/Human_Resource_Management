package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.config.CustomUserDetails;
import com.group07.human_resource_management.dto.request.CreateWfhRequestDto;
import com.group07.human_resource_management.dto.request.ValidateWfhRequestDto;
import com.group07.human_resource_management.dto.response.WfhQuotaResponse;
import com.group07.human_resource_management.dto.response.WfhRequestResponse;
import com.group07.human_resource_management.dto.response.WfhValidationResponse;
import com.group07.human_resource_management.service.IWfhRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wfh-requests")
@RequiredArgsConstructor
public class WfhRequestController {

    private final IWfhRequestService wfhRequestService;

    /**
     * Create new WFH request
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<WfhRequestResponse> createWfhRequest(
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("reason") String reason,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {

        CreateWfhRequestDto request = new CreateWfhRequestDto();
        request.setEmployeeId(employeeId);
        request.setStartDate(LocalDate.parse(startDate));
        request.setEndDate(LocalDate.parse(endDate));
        request.setReason(reason);
        request.setAttachment(attachment);

        WfhRequestResponse response = wfhRequestService.createWfhRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Validate WFH request before submission
     */
    @PostMapping("/validate")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<WfhValidationResponse> validateWfhRequest(
            @Valid @RequestBody ValidateWfhRequestDto request) {
        
        WfhValidationResponse response = wfhRequestService.validateWfhRequest(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get WFH quota for employee
     */
    @GetMapping("/employees/{employeeId}/wfh-quota")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<WfhQuotaResponse> getWfhQuota(@PathVariable Long employeeId) {
        WfhQuotaResponse response = wfhRequestService.getWfhQuota(employeeId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get WFH requests for employee
     */
    @GetMapping("/employees/{employeeId}/wfh-requests")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<List<WfhRequestResponse>> getEmployeeWfhRequests(
            @PathVariable Long employeeId,
            @RequestParam(required = false) String status) {
        
        List<WfhRequestResponse> responses = wfhRequestService.getEmployeeWfhRequests(employeeId, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get WFH request by ID
     */
    @GetMapping("/{requestId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<WfhRequestResponse> getWfhRequestById(@PathVariable Long requestId) {
        WfhRequestResponse response = wfhRequestService.getWfhRequestById(requestId);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel WFH request
     */
    @PatchMapping("/{requestId}/cancel")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<Void> cancelWfhRequest(@PathVariable Long requestId) {
        wfhRequestService.cancelWfhRequest(requestId);
        return ResponseEntity.noContent().build();
    }
}
