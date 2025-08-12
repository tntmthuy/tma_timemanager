package com.timesphere.timesphere.dto.team;

import com.timesphere.timesphere.entity.type.TeamRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotNull(message = "ROLE_REQUIRED")
    private TeamRole newRole; // OWNER hoặc MEMBER
}
