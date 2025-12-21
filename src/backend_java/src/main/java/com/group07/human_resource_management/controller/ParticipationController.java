package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.config.CustomUserDetails;
import com.group07.human_resource_management.dto.request.RegistrationRequest;
import com.group07.human_resource_management.dto.response.ParticipationResponse;
import com.group07.human_resource_management.service.IParticipationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final IParticipationService participationService;

    @PostMapping("/register")
    public ResponseEntity<ParticipationResponse> registerActivity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RegistrationRequest request) {

        ParticipationResponse response = participationService.registerActivity(userDetails.getEmployeeId(), request);

        return ResponseEntity.ok(response);
    }
}
