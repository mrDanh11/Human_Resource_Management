package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateEmployeeRequest;
import com.group07.human_resource_management.dto.response.EmployeeWithAccountResponse;

public interface IEmployeeService {
    EmployeeWithAccountResponse createEmployee(CreateEmployeeRequest request);

}
