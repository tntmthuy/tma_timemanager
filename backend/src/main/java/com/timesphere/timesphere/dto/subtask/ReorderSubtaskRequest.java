package com.timesphere.timesphere.dto.subtask;

import lombok.Data;

@Data
public class ReorderSubtaskRequest {
    private String subtaskId;
    private int targetPosition;
}