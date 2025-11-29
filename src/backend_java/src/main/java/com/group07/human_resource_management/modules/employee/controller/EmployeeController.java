package com.group07.human_resource_management.modules.employee.controller;

import com.group07.human_resource_management.modules.employee.dto.request.CreateEmployeeRequest;
import com.group07.human_resource_management.modules.employee.dto.response.EmployeeWithAccountResponse;
import com.group07.human_resource_management.modules.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public String getEmployee(){
        return "None";
    }

    @PostMapping
    public ResponseEntity<EmployeeWithAccountResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {

        EmployeeWithAccountResponse response = employeeService.createEmployee(request);

        return ResponseEntity.status(201).body(response);
    }
}
