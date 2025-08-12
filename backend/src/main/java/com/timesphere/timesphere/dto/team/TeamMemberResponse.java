package com.timesphere.timesphere.dto.team;

import com.timesphere.timesphere.entity.type.TeamRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TeamMemberResponse {
    private String userId;
    private String email;
    private String fullName;
    private String avatarUrl;
    private TeamRole teamRole;
    private LocalDateTime joinedAt;
}
