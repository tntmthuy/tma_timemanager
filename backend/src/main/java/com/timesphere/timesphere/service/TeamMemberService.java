package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.member.TeamMemberDTO;
import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.TeamRole;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.repository.TeamMemberRepository;
import com.timesphere.timesphere.repository.TeamRepository;
import com.timesphere.timesphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository memberRepo;
    private final TeamRepository teamRepo;

    private void verifyUserIsMember(TeamWorkspace team, User user) {
        boolean isMember = memberRepo.existsByTeamAndUser(team, user);
        if (!isMember) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    public List<TeamMemberDTO> getMembersOfTeam(String teamId, User requester, TeamWorkspace team) {
        if (!memberRepo.existsByTeamAndUser(team, requester)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<TeamMember> members = memberRepo.findAllByTeam(team);
        return members.stream()
                .map(m -> TeamMemberDTO.builder()
                        .userId(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .email(m.getUser().getEmail())
                        .avatarUrl(m.getUser().getAvatarUrl())
                        .build())
                .toList();
    }

    public List<TeamMemberDTO> searchMembersInTeam(String teamId, String keyword, User requester) {
        TeamWorkspace team = teamRepo.findById(teamId)
                .orElseThrow(() -> new AppException(ErrorCode.TEAM_NOT_FOUND));

        // ✅ Kiểm tra requester có phải thành viên
        TeamMember requesterMember = memberRepo.findByTeamAndUser(team, requester)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        List<TeamMember> members = memberRepo.findAllByTeam(team);

        return members.stream()
                .filter(m -> {
                    String name = m.getUser().getFirstname() + " " + m.getUser().getLastname();
                    return name.toLowerCase().contains(keyword.toLowerCase())
                            || m.getUser().getEmail().toLowerCase().contains(keyword.toLowerCase());
                })
                .map(member -> TeamMemberDTO.builder()
                        .memberId(member.getId()) // 👈 bổ sung
                        .userId(member.getUser().getId())
                        .teamId(member.getTeam().getId())
                        .fullName(member.getUser().getFirstname() + " " + member.getUser().getLastname())
                        .email(member.getUser().getEmail())
                        .avatarUrl(member.getUser().getAvatarUrl())
                        .build())
                .toList();
    }
}
