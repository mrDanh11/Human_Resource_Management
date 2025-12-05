package com.group07.human_resource_management.modules.employee.service;

import com.group07.human_resource_management.modules.employee.dto.request.CreateEmployeeRequest;
import com.group07.human_resource_management.modules.employee.dto.response.EmployeeWithAccountResponse;

public interface IEmployeeService {
    EmployeeWithAccountResponse createEmployee(CreateEmployeeRequest request);

}
