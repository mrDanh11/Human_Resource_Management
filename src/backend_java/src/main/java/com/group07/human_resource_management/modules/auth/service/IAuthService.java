package com.group07.human_resource_management.modules.auth.service;

import com.group07.human_resource_management.modules.auth.dto.request.LoginRequest;
import com.group07.human_resource_management.modules.auth.dto.response.LoginResponse;

public interface IAuthService {
    LoginResponse login(LoginRequest request);
}
