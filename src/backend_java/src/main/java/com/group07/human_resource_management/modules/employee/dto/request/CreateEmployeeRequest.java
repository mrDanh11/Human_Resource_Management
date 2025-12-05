package com.group07.human_resource_management.modules.employee.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateEmployeeRequest {
    @NotBlank
    @Size(max = 100)
    private String fullname;

    @NotBlank
    @Size(min = 12, max = 12)
    private String cccd;

    @NotBlank
    @Size(min = 10, max = 13)
    private String taxCode;

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    @Size(max = 50)
    private String bankAccount;

    @NotNull
    private String joinDate;

    @NotBlank
    @Email
    private String email;

    @NotNull
    private Long roleId;

    @NotNull
    private Long departmentId;

    // Optional:
    private String birthday;
    private String gender;  // male, female, other
;
}
