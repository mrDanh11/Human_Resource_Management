package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.CreateLeaveRequest;
import com.group07.human_resource_management.dto.request.RequestSearchCriteria;
import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.dto.response.RequestListResponse;
import com.group07.human_resource_management.entity.ApprovalHistory;
import com.group07.human_resource_management.entity.Employee;
import com.group07.human_resource_management.entity.Request;
import com.group07.human_resource_management.exception.ResourceNotFoundException;
import com.group07.human_resource_management.mapper.RequestMapper;
import com.group07.human_resource_management.repository.ApprovalHistoryRepository;
// import com.group07.human_resource_management.repository.ApproveHistoryRepository;
import com.group07.human_resource_management.repository.EmployeeRepository;
import com.group07.human_resource_management.repository.RequestRepository;
import com.group07.human_resource_management.repository.specification.RequestSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Service
@AllArgsConstructor
public class RequestService implements IRequestService {
    private final RequestRepository requestRepository;
    private final ApprovalHistoryRepository approvalHistoryRepository;
    private final RequestMapper requestMapper;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public void createLeaveRequest(Long employeeId, CreateLeaveRequest req) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Short-hour > 4h -> Half-day
        if ("SHORT_HOUR".equals(req.getMode())) {
            double hours = (double) ChronoUnit.MINUTES.between(req.getFromTime(), req.getToTime()) / 60.0;
            if (hours >= 4.0) {
                req.setMode("HALF_DAY");
                if (req.getSession() == null) {
                    req.setSession(req.getFromTime().getHour() < 12 ? "MORNING" : "AFTERNOON");
                }
            }
        }

        LocalDateTime startTime;
        LocalDateTime endTime;
        double duration = 0.0;

        switch (req.getMode()) {
            case "DAY":
                if (req.getFromDate() == null || req.getToDate() == null) {
                    throw new RuntimeException("Dates required for DAY mode");
                }
                startTime = req.getFromDate().atStartOfDay();
                endTime = req.getToDate().atTime(23, 59, 59);
                duration = calculateBusinessDays(req.getFromDate(), req.getToDate());
                break;
            case "HALF_DAY":
                if (req.getDate() == null || req.getSession() == null) {
                     throw new RuntimeException("Date and Session required for HALF_DAY");
                }
                startTime = req.getDate().atTime(req.getSession().equals("MORNING") ? 8 : 13, 0);
                endTime = req.getDate().atTime(req.getSession().equals("MORNING") ? 12 : 17, 0);
                duration = 0.5;
                break;
            case "SHORT_HOUR":
                if (req.getDate() == null || req.getFromTime() == null || req.getToTime() == null) {
                     throw new RuntimeException("Date and Time required for SHORT_HOUR");
                }
                startTime = req.getDate().atTime(req.getFromTime());
                endTime = req.getDate().atTime(req.getToTime());
                duration = (double) ChronoUnit.MINUTES.between(req.getFromTime(), req.getToTime()) / 60.0 / 8.0;
                break;
            default:
                throw new IllegalArgumentException("Invalid leave mode: " + req.getMode());
        }

        if (endTime.isBefore(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }

        if (requestRepository.existsOverlappingRequest(employeeId, startTime, endTime)) {
            throw new RuntimeException("Request overlap with existing Approved/Pending request");
        }

        // Quota check
        if ("LEAVE_ANNUAL".equals(req.getLeaveType())) {
             if (employee.getAnnualLeaveBalance() == null || employee.getAnnualLeaveBalance() < duration) {
                 throw new RuntimeException("Not enough annual leave balance");
             }
        }

        // Attachment check
        if (("LEAVE_SICK".equals(req.getLeaveType()) || duration > 3.0)) {
            if (req.getAttachment() == null || req.getAttachment().isEmpty()) {
                 throw new RuntimeException("Attachment required for Sick leave or > 3 days");
            }
        }

        Request request = Request.builder()
                .employee(employee)
                .type(req.getLeaveType())
                .leaveMode(req.getMode())
                .session(req.getSession())
                .startTime(startTime)
                .endTime(endTime)
                .duration(duration)
                .status("pending")
                .description(req.getReason())
                .createdAt(LocalDateTime.now())
                // .attachment(url) handled in controller or before service call
                .build();

        requestRepository.save(request);
    }

    private double calculateBusinessDays(LocalDate start, LocalDate end) {
        double days = 0.0;
        LocalDate curr = start;
        while (!curr.isAfter(end)) {
            if (curr.getDayOfWeek() != DayOfWeek.SATURDAY && curr.getDayOfWeek() != DayOfWeek.SUNDAY) {
                days += 1.0;
            }
            curr = curr.plusDays(1);
        }
        return days;
    }

    public RequestDetailReponse getRequestDetail(Long managerId, Long requestId){
        Request request =  requestRepository.findRequestForManager(requestId, managerId)
                .orElseThrow(() -> new ResourceNotFoundException("request not found"));

        ApprovalHistory history = approvalHistoryRepository.findByRequestId(requestId).orElse(null);

        return requestMapper.toRequestDetailReponse(request, history);
    }

    public Page<RequestListResponse> getListRequest(Long managerId, RequestSearchCriteria criteria){
        Pageable pageable = PageRequest.of(criteria.getPage() - 1, criteria.getSize(), Sort.by(Sort.Direction.DESC, "createdAt"));

        // dynamic query
        Specification<Request> spec = Specification.allOf(
                RequestSpecification.hasManager(managerId),
                RequestSpecification.hasStatus(criteria.getStatus()),
                RequestSpecification.hasType(criteria.getType()),
                RequestSpecification.hasKeyword(criteria.getKeyword())
        );

        Page<Request> requestPage = requestRepository.findAll(spec, pageable);

        return requestPage.map(req -> RequestListResponse.builder()
                .id(req.getId())
                .employeeName(req.getEmployee().getFullname())
                .type(req.getType())
                .status(req.getStatus())
                .createdDate(req.getCreatedAt())
                .build());

    }

    @Transactional
    public void cancelRequest(Long employeeId, Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        
        if (!request.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("You do not have permission to cancel this request");
        }
        
        if (!"pending".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }
        
        request.setStatus("cancelled");
        requestRepository.save(request);
    }

    public Page<RequestListResponse> getMyRequests(Long employeeId, RequestSearchCriteria criteria) {
        Pageable pageable = PageRequest.of(criteria.getPage() - 1, criteria.getSize(), Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Request> spec = Specification.allOf(
                RequestSpecification.hasEmployee(employeeId),
                RequestSpecification.hasStatus(criteria.getStatus()),
                RequestSpecification.hasType(criteria.getType()),
                RequestSpecification.hasKeyword(criteria.getKeyword())
        );

        Page<Request> requestPage = requestRepository.findAll(spec, pageable);

        return requestPage.map(req -> RequestListResponse.builder()
                .id(req.getId())
                .employeeName(req.getEmployee().getFullname())
                .type(req.getType())
                .status(req.getStatus())
                .createdDate(req.getCreatedAt())
                .build());
    }
}
