package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.request.RegistrationRequest;
import com.group07.human_resource_management.dto.response.ParticipationResponse;
import com.group07.human_resource_management.entity.Activity;
import com.group07.human_resource_management.entity.Employee;
import com.group07.human_resource_management.entity.Participation;
import com.group07.human_resource_management.repository.ActivityRepository;
import com.group07.human_resource_management.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipationService implements IParticipationService {

    private final ParticipationRepository participationRepository;
    private final ActivityRepository activityRepository;

    @Override
    @Transactional
    public ParticipationResponse registerActivity(Long employeeId, RegistrationRequest request) {
        Employee employee = Employee.builder().id(employeeId).build();

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        LocalDateTime now = LocalDateTime.now();

        if (activity.getRegistrationStartDate() != null && now.isBefore(activity.getRegistrationStartDate())) {
            throw new RuntimeException("Registration has not started yet");
        }

        if (activity.getRegistrationEndDate() != null && now.isAfter(activity.getRegistrationEndDate())) {
            throw new RuntimeException("Registration period has ended");
        }

        if (participationRepository.existsByEmployeeIdAndActivityId(employeeId, activity.getId())) {
            throw new RuntimeException("You have already registered for this activity");
        }
        if (participationRepository.existsByEmployeeIdAndActivityId(employeeId, activity.getId())) {
            throw new RuntimeException("You have already registered for this activity");
        }

        Participation participation = new Participation();
        participation.setEmployee(employee);
        participation.setActivity(activity);
        participation.setRegisterDate(now);
        participation.setStatus("registered"); 
        
        participationRepository.save(participation);

        return ParticipationResponse.builder()
                .employeeId(employeeId)
                .activityId(activity.getId())
                .registeredAt(now)
                .status(participation.getStatus())
                .build();
    }
}
