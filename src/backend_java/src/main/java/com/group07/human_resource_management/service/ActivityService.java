package com.group07.human_resource_management.service;

import com.group07.human_resource_management.dto.response.ActivityListResponse;
import com.group07.human_resource_management.dto.response.ActivityResponse;
import com.group07.human_resource_management.entity.Activity;
import com.group07.human_resource_management.repository.ActivityRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {

    private final ActivityRepository activityRepository;

    @Override
    public ActivityListResponse getAllActivities(int page, int pageSize, String status, String search) {
        // Pageable (Spring Page is 0-indexed, but usually FE sends 1-indexed. 
        // Let's assume Controller handles the conversion or we do it here.
        // Standard: Controller receives 1-based, subtracts 1. 
        // Here we assume 'page' passed in is already 0-based or we handle it.
        // Let's assume the Controller passes 1-based page number, so we subtract 1.
        int pageNo = page > 0 ? page - 1 : 0;
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());

        Specification<Activity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status)) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (StringUtils.hasText(search)) {
                String searchLike = "%" + search.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Activity> activityPage = activityRepository.findAll(spec, pageable);

        List<ActivityResponse> activityResponses = activityPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return ActivityListResponse.builder()
                .activities(activityResponses)
                .total(activityPage.getTotalElements())
                .page(page) // Return the original 1-based page
                .pageSize(pageSize)
                .build();
    }

    @Override
    public ActivityResponse getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        return mapToResponse(activity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .name(activity.getName())
                .description(activity.getDescription())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .registrationStartDate(activity.getRegistrationStartDate())
                .registrationEndDate(activity.getRegistrationEndDate())
                .maxParticipants(activity.getMaxParticipants())
                .location(activity.getLocation())
                .activityType(activity.getActivityType())
                .imageUrl(activity.getImageUrl())
                .organizer(activity.getOrganizer())
                .points(activity.getPoints())
                .status(activity.getStatus())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }
}
