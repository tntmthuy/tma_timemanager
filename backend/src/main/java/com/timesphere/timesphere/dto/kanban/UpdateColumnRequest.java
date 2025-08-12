package com.timesphere.timesphere.dto.kanban;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateColumnRequest {
    @NotBlank
    private String title;
}

