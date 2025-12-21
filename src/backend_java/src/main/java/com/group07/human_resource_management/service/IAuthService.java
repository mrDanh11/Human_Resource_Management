package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.LoginRequest;
import com.group07.human_resource_management.dto.response.LoginResponse;

public interface IAuthService {
    LoginResponse login(LoginRequest request);
}
