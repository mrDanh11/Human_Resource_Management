package com.group07.human_resource_management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private int code;
    private boolean success;
    private String message;
    private T data;
}
