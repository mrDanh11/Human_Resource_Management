package com.group07.human_resource_management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class WfhValidationResponse {
    private Boolean isValid;
    private List<String> errors;
    private List<String> warnings;
    private List<LocalDate> affectedDates;
}
