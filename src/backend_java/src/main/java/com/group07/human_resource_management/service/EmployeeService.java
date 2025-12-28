package com.group07.human_resource_management.service;

import com.group07.human_resource_management.common.utils.PasswordGenerator;
import com.group07.human_resource_management.common.utils.UsernameGenerator;
import com.group07.human_resource_management.entity.Department;
import com.group07.human_resource_management.entity.Employee;
import com.group07.human_resource_management.entity.Role;
import com.group07.human_resource_management.entity.UserAccount;
import com.group07.human_resource_management.repository.UserAccountRepository;
import com.group07.human_resource_management.repository.DepartmentRepository;
import com.group07.human_resource_management.dto.request.CreateEmployeeRequest;
import com.group07.human_resource_management.dto.response.EmployeeResponse;
import com.group07.human_resource_management.dto.response.EmployeeWithAccountResponse;
import com.group07.human_resource_management.dto.response.UserAccountResponse;
import com.group07.human_resource_management.repository.EmployeeRepository;
import com.group07.human_resource_management.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmployeeService implements IEmployeeService {
    private final EmployeeRepository employeeRepository;
    private final UserAccountRepository userAccountRepository;

    private final UsernameGenerator usernameGenerator;
    private final PasswordGenerator passwordGenerator;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public EmployeeWithAccountResponse createEmployee(CreateEmployeeRequest req) {
        Role role = roleRepository.findById(req.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // 1) Map request → Employee entity
        Employee emp = new Employee();
        emp.setFullname(req.getFullname());
        emp.setCccd(req.getCccd());
        emp.setTaxCode(req.getTaxCode());
        emp.setPhone(req.getPhone());
        emp.setAddress(req.getAddress());
        emp.setBankAccount(req.getBankAccount());
        emp.setJoinDate(LocalDate.parse(req.getJoinDate()));
        emp.setEmail(req.getEmail());
        emp.setRole(role);
        emp.setDepartment(department);
        emp.setBirthday(req.getBirthday() != null ? LocalDate.parse(req.getBirthday()) : null);
        emp.setGender(req.getGender());
        emp.setStatus("active");
        emp.setCreatedAt(LocalDateTime.now());
        emp.setUpdatedAt(LocalDateTime.now());

        // 2) Lưu Employee vào DB
        Employee saved = employeeRepository.save(emp);

        // 3) Generate username và password
        String username = usernameGenerator.generate(saved);
        String rawPassword = passwordGenerator.generate(saved);

        // 4) Mã hoá password
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 5) Lưu UserAccount
        UserAccount account = UserAccount.builder()
                .employee(saved)
                .username(username)
                .passwordHash(encodedPassword)
                .isActive(true)
                .isVerified(false)
                .failedLoginAttempts(0)
                .createdAt(LocalDateTime.now())
                .build();

        UserAccount savedAccount = userAccountRepository.save(account);

        // 6) Build EmployeeResponse
        EmployeeResponse empRes = EmployeeResponse.builder()
                .id(saved.getId())
                .fullname(saved.getFullname())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .address(saved.getAddress())
                .cccd(saved.getCccd())
                .taxCode(saved.getTaxCode())
                .bankAccount(saved.getBankAccount())
                .birthday(req.getBirthday())
                .gender(req.getGender())
                .joinDate(req.getJoinDate())
                .roleId(req.getRoleId())
                .departmentId(req.getDepartmentId())
                .status(saved.getStatus())
                .build();

        // 7) Build AccountResponse
        UserAccountResponse accRes = UserAccountResponse.builder()
                .id(savedAccount.getId())
                .employeeId(saved.getId())
                .username(savedAccount.getUsername())
                .isActive(savedAccount.getIsActive())
                .isVerified(savedAccount.getIsVerified())
                .createdAt(savedAccount.getCreatedAt())
                .build();

        // 8) Trả về response gộp
        return EmployeeWithAccountResponse.builder()
                .employee(empRes)
                .account(accRes)
                .initialPassword(rawPassword)  // trả password để admin biết
                .build();
    }
}
