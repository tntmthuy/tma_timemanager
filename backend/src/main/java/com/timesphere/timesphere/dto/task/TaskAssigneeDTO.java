package com.timesphere.timesphere.dto.task;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskAssigneeDTO {
    private String id; // teamMemberId
    private String userId;
    private String fullName;
    private String avatarUrl;
    private String teamRole;
}
