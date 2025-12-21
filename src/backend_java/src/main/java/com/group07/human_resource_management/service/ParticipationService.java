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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationService implements IParticipationService {

    private final ParticipationRepository participationRepository;
    private final ActivityRepository activityRepository;

    @Override
    public List<ParticipationResponse> getMyParticipations(Long employeeId) {
        List<Participation> participations = participationRepository.findByEmployeeId(employeeId);
        return participations.stream()
                .map(p -> ParticipationResponse.builder()
                        .employeeId(p.getEmployee().getId())
                        .activityId(p.getActivity().getId())
                        .registeredAt(p.getRegisterDate())
                        .status(p.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

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
        participation.setCreatedAt(now);
        participation.setStatus("registered"); 
        
        participationRepository.save(participation);

        return ParticipationResponse.builder()
                .employeeId(employeeId)
                .activityId(activity.getId())
                .registeredAt(now)
                .status(participation.getStatus())
                .build();
    }

    @Override
    @Transactional
    public void unregisterActivity(Long employeeId, Long activityId) {
        Participation participation = participationRepository.findByEmployeeId(employeeId).stream()
                .filter(p -> p.getActivity().getId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("You have not registered for this activity"));

        Activity activity = participation.getActivity();
        LocalDateTime now = LocalDateTime.now();

        if (activity.getRegistrationEndDate() != null && now.isAfter(activity.getRegistrationEndDate())) {
            throw new RuntimeException("Cannot unregister. Registration period has ended.");
        }

        participationRepository.delete(participation);
    }
}
