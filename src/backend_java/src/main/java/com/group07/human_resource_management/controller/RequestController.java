package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.config.CustomUserDetails;
import com.group07.human_resource_management.dto.request.CreateLeaveRequest;
import com.group07.human_resource_management.dto.request.RequestSearchCriteria;
import com.group07.human_resource_management.dto.response.ApiResponse;
import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.dto.response.RequestListResponse;
import com.group07.human_resource_management.service.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class RequestController {
    private final IRequestService requestService;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ApiResponse<String> createLeaveRequest(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute CreateLeaveRequest createLeaveRequest
    ) {
        requestService.createLeaveRequest(userDetails.getEmployeeId(), createLeaveRequest);
        return ApiResponse.<String>builder()
                .code(HttpStatus.CREATED.value())
                .success(true)
                .message("Leave request created successfully")
                .data("Request submitted")
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ApiResponse<RequestDetailReponse> getRequestDetail(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails manager) {

        RequestDetailReponse response = requestService.getRequestDetail(manager.getEmployeeId(), id);
        return ApiResponse.<RequestDetailReponse>builder()
                .code(HttpStatus.OK.value())
                .success(true)
                .message("Request Detail Successfully")
                .data(response)
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ApiResponse<Page<RequestListResponse>> getListRequest(@AuthenticationPrincipal CustomUserDetails manager,
                                                                @ModelAttribute RequestSearchCriteria criteria) {  // modelattribute lay patams tren url gan vao DTO

        Page<RequestListResponse> response = requestService.getListRequest(manager.getEmployeeId(), criteria);
        return ApiResponse.<Page<RequestListResponse>>builder()
                .code(HttpStatus.OK.value())
                .data(response)
                .success(true)
                .message("Request List Successfully")
                .build();
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<String> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        requestService.cancelRequest(userDetails.getEmployeeId(), id);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .success(true)
                .message("Request cancelled successfully")
                .data("Cancelled")
                .build();
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<Page<RequestListResponse>> getMyRequests(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute RequestSearchCriteria criteria
    ) {
        Page<RequestListResponse> response = requestService.getMyRequests(userDetails.getEmployeeId(), criteria);
        return ApiResponse.<Page<RequestListResponse>>builder()
                .code(HttpStatus.OK.value())
                .success(true)
                .message("My request list retrieved successfully")
                .data(response)
                .build();
    }
}
