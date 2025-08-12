package com.timesphere.timesphere.dto.task;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MoveTaskToColumnRequest {
    @NotNull
    private String targetColumnId;
    @Min(0)
    private int targetPosition;
}
