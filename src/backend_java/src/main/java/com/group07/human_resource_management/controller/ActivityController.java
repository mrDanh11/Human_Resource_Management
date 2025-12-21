package com.group07.human_resource_management.controller;

import com.group07.human_resource_management.dto.request.RegistrationActivityRequest;
import com.group07.human_resource_management.dto.response.RegistrationActivityResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/activity")
public class ActivityController {
    @PostMapping("/register")
    public ResponseEntity<RegistrationActivityResponse> registerActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RegistrationActivityRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(new RegistrationActivityResponse());
    }
}
