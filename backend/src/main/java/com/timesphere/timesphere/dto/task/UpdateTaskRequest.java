package com.timesphere.timesphere.dto.task;

import com.timesphere.timesphere.entity.type.Priority;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
public class UpdateTaskRequest {
    private String title;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateDue;
    private Priority priority;
}
