package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.team.TeamMemberResponse;
import com.timesphere.timesphere.dto.team.TeamResponse;
import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;

import java.util.List;

public class TeamMapper {

    public static TeamResponse toDto(TeamWorkspace team, List<TeamMember> members) {
        User creator = team.getCreatedBy();

        List<TeamMemberResponse> mappedMembers = members.stream()
                .map(member -> TeamMemberResponse.builder()
                        .userId(member.getUser().getId())
                        .email(member.getUser().getEmail())
                        .fullName(member.getUser().getFirstname() + " " + member.getUser().getLastname())
                        .avatarUrl(member.getUser().getAvatarUrl())
                        .teamRole(member.getTeamRole())
                        .joinedAt(member.getCreatedAt()) // Lấy từ BaseEntity
                        .build())
                .toList();

        return TeamResponse.builder()
                .id(team.getId())
                .teamName(team.getTeamName())
                .createdById(creator.getId())
                .createdByEmail(creator.getEmail())
                .createdByFullName(creator.getFirstname() + " " + creator.getLastname())
                .description(team.getDescription())
                .members(mappedMembers)
                .build();
    }
}
