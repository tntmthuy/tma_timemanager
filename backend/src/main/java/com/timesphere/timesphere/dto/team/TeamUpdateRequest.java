package com.timesphere.timesphere.dto.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeamUpdateRequest {
    @NotBlank(message = "TEAM_NAME_REQUIRED")
    private String newName;

    @Size(max = 500, message = "DESCRIPTION_TOO_LONG")
    private String description;
}
