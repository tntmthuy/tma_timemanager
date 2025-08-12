package com.timesphere.timesphere.dto.focus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FocusSessionResponse {
    private Long id;
    private String mode;             // "focus" hoặc "break"
    private int targetMinutes;       // Mục tiêu
    private int actualMinutes;       // Thực tế
    private String status;           // "COMPLETED" hoặc "CANCELLED"
    private String startedAt;        // ISO format
    private String endedAt;          // ISO format
    private String description;
    private String message;          // Tin nhắn hiển thị FE (tuỳ trạng thái)
}