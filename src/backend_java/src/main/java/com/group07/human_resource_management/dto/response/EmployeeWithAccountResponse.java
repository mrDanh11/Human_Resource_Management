package com.group07.human_resource_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeWithAccountResponse {
    private EmployeeResponse employee;
    private UserAccountResponse account;
    private String initialPassword;
}
