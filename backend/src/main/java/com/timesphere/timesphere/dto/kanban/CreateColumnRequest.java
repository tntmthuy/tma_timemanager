package com.timesphere.timesphere.dto.kanban;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateColumnRequest {
    private String workspaceId;

    @NotBlank(message = "Tiêu đề subtask không được để trống.")
    private String title;

    private Integer position;
}
