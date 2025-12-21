package com.group07.human_resource_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String fullname;
    private String email;
    private String phone;
    private String address;

    private String cccd;
    private String taxCode;
    private String bankAccount;

    private String birthday;
    private String gender;
    private String joinDate;

    private Long roleId;
    private Long departmentId;

    private String status;
}
