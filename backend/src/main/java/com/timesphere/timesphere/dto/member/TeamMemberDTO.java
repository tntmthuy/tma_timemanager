package com.timesphere.timesphere.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamMemberDTO {
    private Long memberId;
    private String userId;
    private String teamId;
    private String fullName;
    private String email;
    private String avatarUrl;
}