package com.timesphere.timesphere.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AssignedTaskSummary {
    private String taskId;
    private String title;
    private String teamId;
    private String teamName;
    private String teamUrl;
    private LocalDateTime dateDue;
}