package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.config.CustomUserDetails;
import com.group07.human_resource_management.dto.request.CreateActivityRequest;
import com.group07.human_resource_management.dto.response.ActivityListResponse;
import com.group07.human_resource_management.dto.response.ActivityResponse;
import com.group07.human_resource_management.service.IActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final IActivityService activityService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ActivityResponse> createActivity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateActivityRequest request) {
        ActivityResponse response = activityService.createActivity(userDetails.getEmployeeId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ActivityListResponse> getAllActivities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        ActivityListResponse response = activityService.getAllActivities(page, pageSize, status, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivityById(@PathVariable Long id) {
        ActivityResponse response = activityService.getActivityById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
