package com.timesphere.timesphere.dto.subtask;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubtaskDTO {
    private String id;
    private String title;
    private Boolean isComplete;
    private Integer subtaskPosition;
}
