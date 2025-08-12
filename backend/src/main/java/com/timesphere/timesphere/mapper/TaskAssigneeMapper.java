package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.task.TaskAssigneeDTO;
import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.User;

public class TaskAssigneeMapper {

    public static TaskAssigneeDTO toDto(TeamMember teamMember) {
        User user = teamMember.getUser();

        return TaskAssigneeDTO.builder()
                .id(teamMember.getId().toString())
                .userId(user.getId())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .teamRole(teamMember.getTeamRole().name())
                .build();
    }
}