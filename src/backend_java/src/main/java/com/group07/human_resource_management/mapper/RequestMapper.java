package com.group07.human_resource_management.mapper;

import com.group07.human_resource_management.dto.response.RequestDetailReponse;
import com.group07.human_resource_management.entity.ApprovalHistory;
import com.group07.human_resource_management.entity.Request;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface RequestMapper {
    @Mapping(source = "request.id", target = "id")
    @Mapping(source = "request.type", target = "type")
    @Mapping(source = "request.attachment", target = "attachment")
    @Mapping(source = "request.description", target = "description")
    @Mapping(source = "request.status", target = "status")
    @Mapping(source = "request.employee.fullname", target = "employeeName")
    @Mapping(source = "request.employee.id", target = "employeeId")
    @Mapping(source = "request.leaveMode", target = "leaveMode")
    @Mapping(source = "request.session", target = "session")

    // map from ApprovalHistory
    @Mapping(source = "history", target = "actionDate", qualifiedByName = "mapActionDate")
    @Mapping(source = "history", target = "managerNote", qualifiedByName = "mapManagerNote")
    @Mapping(source = "history", target = "managerActionStatus", qualifiedByName = "mapManagerStatus")
    RequestDetailReponse toRequestDetailReponse(Request request, ApprovalHistory history);

    // helper
    @Named("mapActionDate")
    default java.time.LocalDateTime mapActionDate(ApprovalHistory history) {
        return history != null ? history.getCreatedAt() : null;
    }

    @Named("mapManagerNote")
    default String mapManagerNote(ApprovalHistory history) {
        return history != null ? history.getNote() : null;
    }

    @Named("mapManagerStatus")
    default String mapManagerStatus(ApprovalHistory history) {
        return history != null ? history.getStatus() : null;
    }
}
