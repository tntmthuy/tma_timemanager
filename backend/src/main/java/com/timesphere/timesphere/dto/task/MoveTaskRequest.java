package com.timesphere.timesphere.dto.task;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MoveTaskRequest {
    @NotNull
    private String targetColumnId;
}
