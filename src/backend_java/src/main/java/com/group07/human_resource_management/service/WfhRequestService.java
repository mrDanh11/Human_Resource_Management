package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateWfhRequestDto;
import com.group07.human_resource_management.dto.request.ValidateWfhRequestDto;
import com.group07.human_resource_management.dto.response.WfhQuotaResponse;
import com.group07.human_resource_management.dto.response.WfhRequestResponse;
import com.group07.human_resource_management.dto.response.WfhValidationResponse;
import com.group07.human_resource_management.entity.Employee;
import com.group07.human_resource_management.entity.Request;
import com.group07.human_resource_management.repository.EmployeeRepository;
import com.group07.human_resource_management.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WfhRequestService implements IWfhRequestService {

    private final RequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;

    private static final String UPLOAD_DIR = "uploads/wfh-attachments/";
    private static final int MONTHLY_WFH_LIMIT = 10;

    @Override
    @Transactional
    public WfhRequestResponse createWfhRequest(CreateWfhRequestDto request) {
        // Validate employee exists
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Validate dates
        LocalDateTime startTime = request.getStartDate().atStartOfDay();
        LocalDateTime endTime = request.getEndDate().atTime(23, 59, 59);

        if (endTime.isBefore(startTime)) {
            throw new RuntimeException("End date must be after start date");
        }

        // Check for overlapping requests
        List<Request> overlapping = requestRepository.findOverlappingRequests(
                request.getEmployeeId(), startTime, endTime);
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("WFH request overlaps with existing leave, business trip, or WFH requests");
        }

        // Calculate WFH days
        long wfhDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        // Check monthly quota
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        List<Request> approvedRequests = requestRepository.findApprovedWfhRequestsInMonth(
                request.getEmployeeId(), currentYear, currentMonth);
        
        int usedDays = approvedRequests.stream()
                .mapToInt(req -> {
                    LocalDate start = req.getStartTime().toLocalDate();
                    LocalDate end = req.getEndTime().toLocalDate();
                    return (int) ChronoUnit.DAYS.between(start, end) + 1;
                })
                .sum();

        if (usedDays + wfhDays > MONTHLY_WFH_LIMIT) {
            throw new RuntimeException("WFH request exceeds monthly limit of " + MONTHLY_WFH_LIMIT + " days");
        }

        // Handle file attachment
        String attachmentPath = null;
        if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
            attachmentPath = saveAttachment(request.getAttachment());
        }

        // Create request entity
        Request wfhRequest = Request.builder()
                .employee(employee)
                .description(request.getReason())
                .startTime(startTime)
                .endTime(endTime)
                .type("wfh")
                .attachment(attachmentPath)
                .status("pending")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Request savedRequest = requestRepository.save(wfhRequest);

        return mapToResponse(savedRequest);
    }

    @Override
    public WfhValidationResponse validateWfhRequest(ValidateWfhRequestDto request) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<LocalDate> affectedDates = new ArrayList<>();

        LocalDateTime startTime = request.getStartDate().atStartOfDay();
        LocalDateTime endTime = request.getEndDate().atTime(23, 59, 59);

        // Check date validity
        if (endTime.isBefore(startTime)) {
            errors.add("End date must be after start date");
            return WfhValidationResponse.builder()
                    .isValid(false)
                    .errors(errors)
                    .warnings(warnings)
                    .affectedDates(affectedDates)
                    .build();
        }

        // Check for overlapping requests
        List<Request> overlapping = requestRepository.findOverlappingRequests(
                request.getEmployeeId(), startTime, endTime);
        
        if (!overlapping.isEmpty()) {
            errors.add("WFH request conflicts with existing " + overlapping.get(0).getType() + " request");
        }

        // Calculate affected dates
        LocalDate current = request.getStartDate();
        while (!current.isAfter(request.getEndDate())) {
            affectedDates.add(current);
            current = current.plusDays(1);
        }

        // Check monthly quota
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        List<Request> approvedRequests = requestRepository.findApprovedWfhRequestsInMonth(
                request.getEmployeeId(), currentYear, currentMonth);
        
        int usedDays = approvedRequests.stream()
                .mapToInt(req -> {
                    LocalDate start = req.getStartTime().toLocalDate();
                    LocalDate end = req.getEndTime().toLocalDate();
                    return (int) ChronoUnit.DAYS.between(start, end) + 1;
                })
                .sum();

        long requestDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        
        if (usedDays + requestDays > MONTHLY_WFH_LIMIT) {
            errors.add("WFH request would exceed monthly limit of " + MONTHLY_WFH_LIMIT + " days");
        }

        // Warning for long-term WFH
        if (requestDays > 5) {
            warnings.add("WFH requests longer than 5 days require additional approval");
        }

        return WfhValidationResponse.builder()
                .isValid(errors.isEmpty())
                .errors(errors)
                .warnings(warnings)
                .affectedDates(affectedDates)
                .build();
    }

    @Override
    public WfhQuotaResponse getWfhQuota(Long employeeId) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        
        List<Request> approvedRequests = requestRepository.findApprovedWfhRequestsInMonth(
                employeeId, currentYear, currentMonth);
        
        int usedDays = approvedRequests.stream()
                .mapToInt(req -> {
                    LocalDate start = req.getStartTime().toLocalDate();
                    LocalDate end = req.getEndTime().toLocalDate();
                    return (int) ChronoUnit.DAYS.between(start, end) + 1;
                })
                .sum();

        int remainingDays = MONTHLY_WFH_LIMIT - usedDays;

        YearMonth yearMonth = YearMonth.of(currentYear, currentMonth);
        String currentMonthStr = yearMonth.toString();

        return WfhQuotaResponse.builder()
                .monthlyLimit(MONTHLY_WFH_LIMIT)
                .usedDays(usedDays)
                .remainingDays(remainingDays)
                .currentMonth(currentMonthStr)
                .build();
    }

    @Override
    public List<WfhRequestResponse> getEmployeeWfhRequests(Long employeeId, String status) {
        List<Request> requests;
        
        if (StringUtils.hasText(status)) {
            requests = requestRepository.findByEmployeeIdAndStatusOrderByCreatedAtDesc(employeeId, status);
        } else {
            requests = requestRepository.findByEmployeeIdAndTypeOrderByCreatedAtDesc(employeeId, "wfh");
        }

        return requests.stream()
                .filter(r -> "wfh".equals(r.getType()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WfhRequestResponse getWfhRequestById(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("WFH request not found"));

        if (!"wfh".equals(request.getType())) {
            throw new RuntimeException("Request is not a WFH request");
        }

        return mapToResponse(request);
    }

    @Override
    @Transactional
    public void cancelWfhRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("WFH request not found"));

        if (!"pending".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        request.setStatus("cancelled");
        request.setUpdatedAt(LocalDateTime.now());
        requestRepository.save(request);
    }

    private WfhRequestResponse mapToResponse(Request request) {
        return WfhRequestResponse.builder()
                .id(request.getId())
                .employeeId(request.getEmployee().getId())
                .employeeName(request.getEmployee().getFullname())
                .startDate(request.getStartTime().toLocalDate())
                .endDate(request.getEndTime().toLocalDate())
                .reason(request.getDescription())
                .attachment(request.getAttachment())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    private String saveAttachment(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return UPLOAD_DIR + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save attachment: " + e.getMessage());
        }
    }
}
