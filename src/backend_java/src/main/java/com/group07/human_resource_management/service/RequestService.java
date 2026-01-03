package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.RequestSearchCriteria;
import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.dto.response.RequestListResponse;
import com.group07.human_resource_management.entity.ApprovalHistory;
import com.group07.human_resource_management.entity.Request;
import com.group07.human_resource_management.exception.ResourceNotFoundException;
import com.group07.human_resource_management.mapper.RequestMapper;
import com.group07.human_resource_management.repository.ApproveHistoryRepository;
import com.group07.human_resource_management.repository.RequestRepository;
import com.group07.human_resource_management.repository.specification.RequestSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RequestService implements IRequestService {
    private final RequestRepository requestRepository;
    private final ApproveHistoryRepository approveHistoryRepository;
    private final RequestMapper requestMapper;

    public RequestDetailReponse getRequestDetail(Long managerId, Long requestId){
        Request request =  requestRepository.findRequestForManager(requestId, managerId)
                .orElseThrow(() -> new ResourceNotFoundException("request not found"));

        ApprovalHistory history = approveHistoryRepository.findByRequestId(requestId).orElse(null);

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

}
