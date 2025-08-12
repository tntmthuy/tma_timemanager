package com.timesphere.timesphere.dto.subtask;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateSubtaskRequest {

    @NotBlank(message = "Tiêu đề subtask không được để trống.")
    private String title;
}