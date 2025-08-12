package com.timesphere.timesphere.dto.subtask;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateSubtaskRequest {
    @NotNull(message = "ID parent task không được để trống.")
    private String parentTaskId;

    @NotBlank(message = "Tiêu đề subtask không được để trống.")
    private String title;
}
