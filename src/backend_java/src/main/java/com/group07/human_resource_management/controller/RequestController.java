package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.config.CustomUserDetails;
import com.group07.human_resource_management.dto.response.ApiResponse;
import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.service.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manager/request")
@RequiredArgsConstructor
public class RequestController {
    private final IRequestService requestService;

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
}
