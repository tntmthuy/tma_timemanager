package com.timesphere.timesphere.dto.team;

import com.timesphere.timesphere.entity.type.InvitationStatus;
import com.timesphere.timesphere.entity.type.TeamRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class InvitationResponse {
    private String teamId;
    private String teamName;
    private TeamRole invitedRole;
    private InvitationStatus status;
    private String invitedByEmail;
    private LocalDateTime invitedAt;
    private String timeAgo;
}
