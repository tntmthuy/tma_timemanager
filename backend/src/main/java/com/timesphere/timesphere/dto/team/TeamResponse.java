package com.timesphere.timesphere.dto.team;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeamResponse {
    String id;
    String teamName;
    String createdById;
    String createdByEmail;
    String createdByFullName;
    List<TeamMemberResponse> members;
    String description;
}
