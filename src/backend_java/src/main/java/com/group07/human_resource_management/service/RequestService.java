package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.entity.ApprovalHistory;
import com.group07.human_resource_management.entity.Request;
import com.group07.human_resource_management.exception.ResourceNotFoundException;
import com.group07.human_resource_management.mapper.RequestMapper;
import com.group07.human_resource_management.repository.ApproveHistoryRepository;
import com.group07.human_resource_management.repository.RequestRepository;
import lombok.AllArgsConstructor;
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

}
