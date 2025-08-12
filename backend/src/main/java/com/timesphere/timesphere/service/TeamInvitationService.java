package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.team.InvitationResponse;
import com.timesphere.timesphere.dto.user.UserSuggestionResponse;
import com.timesphere.timesphere.entity.TeamInvitation;
import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.InvitationStatus;
import com.timesphere.timesphere.entity.type.NotificationType;
import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.entity.type.TeamRole;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.repository.*;
import com.timesphere.timesphere.util.TimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamInvitationService {

    private final TeamInvitationRepository invitationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepo;

    // Tìm người dùng chưa trong team để mời vào team
    public List<UserSuggestionResponse> searchUsersForInvitation(String keyword, String teamId) {
        List<User> users = userRepository.searchUsersNotInTeamWithNoPendingInvite(keyword, teamId);
        return users.stream()
                .map(u -> new UserSuggestionResponse(
                        u.getId(),
                        u.getFirstname() + " " + u.getLastname(),
                        u.getEmail(),
                        u.getAvatarUrl()))
                .toList();
    }

    private TeamWorkspace findTeamOrThrow(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new AppException(ErrorCode.TEAM_NOT_FOUND));
    }

    public void validateInviteBeforeSending(TeamWorkspace team, User invitedUser) {
        if (teamMemberRepository.existsByTeamAndUser(team, invitedUser)) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_TEAM);
        }

        var existingInviteOpt = invitationRepository
                .findTopByTeamAndInvitedUserOrderByCreatedAtDesc(team, invitedUser);

        if (existingInviteOpt.isPresent()) {
            TeamInvitation lastInvite = existingInviteOpt.get();

            if (lastInvite.getStatus() == InvitationStatus.PENDING) {
                throw new AppException(ErrorCode.USER_ALREADY_INVITED);
            }

            Duration diff = Duration.between(lastInvite.getCreatedAt(), LocalDateTime.now());
            if (diff.getSeconds() < 60) {
                long secondsLeft = Math.max(1, 60 - diff.getSeconds());
                throw new AppException(ErrorCode.INVITE_TOO_SOON,
                        "Vui lòng đợi " + secondsLeft + " giây trước khi mời lại người dùng này.");
            }
        }
    }

    @Transactional
    public void sendInvitation(TeamWorkspace team, User invitedUser, User inviter, TeamRole role) {
        // Xoá toàn bộ lời mời cũ của user này trong team
        invitationRepository.deleteAllByTeamAndInvitedUser(team, invitedUser);

        // Tạo mới lời mời
        invitationRepository.save(TeamInvitation.builder()
                .team(team)
                .invitedUser(invitedUser)
                .invitedBy(inviter)
                .invitedRole(role)
                .status(InvitationStatus.PENDING)
                .build());
        log.info("📨 Gửi lại lời mời tới {} từ team {} với vai trò {}", invitedUser.getEmail(), team.getTeamName(), role);

        // ✅ Gửi thông báo kèm theo
        notificationService.notify(
                invitedUser,
                inviter,
                inviter.getFullName() + " has invited you to join the team",
                "Team: " + team.getTeamName(),
                "/mainpage/notification",
                NotificationType.INVITE,
                team.getId()
        );
    }

    public List<InvitationResponse> getPendingInvitations(User user) {
        return invitationRepository.findAllByInvitedUserAndStatus(user, InvitationStatus.PENDING)
                .stream()
                .map(invite -> new InvitationResponse(
                        invite.getTeam().getId(),
                        invite.getTeam().getTeamName(),
                        invite.getInvitedRole(),
                        invite.getStatus(),
                        invite.getInvitedBy().getEmail(),
                        invite.getCreatedAt(),
                        TimeUtils.timeAgo(invite.getCreatedAt())
                ))
                .toList();
    }

    @Transactional
    public void acceptInvitation(String teamId, User user) {
        TeamWorkspace team = findTeamOrThrow(teamId);

        TeamInvitation invite = invitationRepository
                .findTopByTeamAndInvitedUserOrderByCreatedAtDesc(team, user)
                .orElseThrow(() -> new AppException(ErrorCode.INVITATION_NOT_FOUND));

        if (!invite.getStatus().equals(InvitationStatus.PENDING)) {
            throw new AppException(ErrorCode.INVITATION_NOT_FOUND);
        }

        long count = teamMemberRepository.countByUser(user);
        if (user.getRole() == Role.FREE && count >= 5) {
            throw new AppException(ErrorCode.TEAM_LIMIT_REACHED_FOR_FREE_USER);
        }

        log.info("👉 Đang tìm lời mời cho user={} và team={}", user.getId(), teamId);

        // 👉 Lưu người vừa tham gia team
        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .teamRole(invite.getInvitedRole())
                .build();
        teamMemberRepository.save(member);

        // 👉 Cập nhật trạng thái lời mời
        invite.setStatus(InvitationStatus.ACCEPTED);
        notificationRepo.markAsReadByUserAndTeam(user.getId(), team.getId(), NotificationType.INVITE);
        invitationRepository.save(invite);

        // ✅ Gửi thông báo đến những người còn lại
        List<TeamMember> others = teamMemberRepository.findAllByTeam(team).stream()
                .filter(tm -> !tm.getUser().getId().equals(user.getId()))
                .toList();

        for (TeamMember tm : others) {
            notificationService.notify(
                    tm.getUser(),
                    user,
                    user.getFullName() + " has just joined the team!",
                    "Team: " + team.getTeamName(),
                    "/mainpage/team/" + team.getId(),
                    NotificationType.JOIN_TEAM,
                    team.getId()
            );
        }

        log.info("✅ Người dùng {} đã chấp nhận lời mời vào team {}", user.getEmail(), team.getTeamName());
    }

    @Transactional
    public void declineInvitation(String teamId, User user) {
        TeamWorkspace team = findTeamOrThrow(teamId);

        TeamInvitation invite = invitationRepository
                .findTopByTeamAndInvitedUserOrderByCreatedAtDesc(team, user)
                .orElseThrow(() -> new AppException(ErrorCode.INVITATION_NOT_FOUND));

        if (!invite.getStatus().equals(InvitationStatus.PENDING)) {
            throw new AppException(ErrorCode.INVITATION_NOT_FOUND);
        }
        log.info("👉 Đang tìm lời mời cho user={} và team={}", user.getId(), teamId);
        invite.setStatus(InvitationStatus.DECLINED);
        notificationRepo.markAsReadByUserAndTeam(user.getId(), team.getId(), NotificationType.INVITE);
        invitationRepository.save(invite);

        log.info("🚫 Người dùng {} đã từ chối lời mời vào team {}", user.getEmail(), team.getTeamName());
    }
}