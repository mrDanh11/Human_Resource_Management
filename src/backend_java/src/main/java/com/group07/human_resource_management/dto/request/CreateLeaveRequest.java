package com.group07.human_resource_management.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateLeaveRequest {
    
    @NotNull(message = "Loại nghỉ không được để trống")
    private String leaveType; // ANNUAL, SICK, UNPAID, SATURDAY_OFF

    @NotNull(message = "Hình thức nghỉ không được để trống")
    private String mode; // DAY, HALF_DAY, SHORT_HOUR

    // Dùng cho nghỉ theo Ngày
    private LocalDate fromDate;
    private LocalDate toDate;

    // Dùng cho nghỉ Buổi/Giờ
    private LocalDate date;
    
    // Dùng cho Half-day
    private String session; // MORNING, AFTERNOON

    // Dùng cho Short-hour
    private LocalTime fromTime;
    private LocalTime toTime;

    private String reason;
    
    // Attachment - File minh chứng
    private MultipartFile attachment;
}
