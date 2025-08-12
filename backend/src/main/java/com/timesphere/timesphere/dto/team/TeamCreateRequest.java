package com.timesphere.timesphere.dto.team;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamCreateRequest {
    @NotBlank(message = "TEAM_NAME_REQUIRED")
    private String teamName;

    @Valid
    private List<@Valid MemberInvite> invites; // Có thể để null hoặc rỗng

    @Size(max = 500, message = "DESCRIPTION_TOO_LONG")
    private String description;
}