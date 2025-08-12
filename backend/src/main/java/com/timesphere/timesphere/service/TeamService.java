package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.dto.team.*;
import com.timesphere.timesphere.entity.*;
import com.timesphere.timesphere.entity.type.AttachmentType;
import com.timesphere.timesphere.entity.type.InvitationStatus;
import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.entity.type.TeamRole;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.mapper.AttachmentMapper;
import com.timesphere.timesphere.mapper.TeamMapper;
import com.timesphere.timesphere.repository.*;
import com.timesphere.timesphere.util.TimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final UserRepository userRepository;

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    private final TeamInvitationService invitationService;
    private final TeamInvitationRepository invitationRepository;

    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;

    private final TeamInvitationRepository teamInvitationRepo;
    private final NotificationRepository notificationRepo;
    private final TaskRepository taskRepo;
    private final TaskCommentRepository taskCommentRepo;

    private void validateTeamMemberLimit(TeamWorkspace team, int incomingCount) {
        long currentCount = teamMemberRepository.countByTeam(team);
        if (currentCount + incomingCount > 20) {
            throw new AppException(ErrorCode.MAX_TEAM_MEMBER_REACHED,
                    "Mỗi nhóm chỉ được tối đa 20 thành viên. Hiện tại đã có " + currentCount + " người.");
        }
    }

    public TeamResponse createTeam(TeamCreateRequest request, User currentUser) {
        if (request.getTeamName() == null || request.getTeamName().isBlank()) {
            throw new AppException(ErrorCode.TEAM_NAME_REQUIRED);
        }

        // Kiểm tra quota nếu user thuộc gói FREE
        if (currentUser.getRole() == Role.FREE) {
            long count = teamMemberRepository.countByUser(currentUser);
            if (count >= 5) {
                throw new AppException(ErrorCode.TEAM_CREATE_LIMIT_FOR_FREE_USER);
            }
        }

        // Tạo nhóm
        TeamWorkspace team = TeamWorkspace.builder()
                .teamName(request.getTeamName())
                .createdBy(currentUser)
                .description(request.getDescription())
                .build();
        teamRepository.save(team);

        // Người tạo là OWNER
        List<TeamMember> members = new ArrayList<>();
        members.add(TeamMember.builder()
                .user(currentUser)
                .team(team)
                .teamRole(TeamRole.OWNER)
                .build());
        teamMemberRepository.saveAll(members);

        // Gửi lời mời nếu có
        if (request.getInvites() != null) {
            validateTeamMemberLimit(team, request.getInvites().size());
            for (MemberInvite invite : request.getInvites()) {
                String email = invite.getEmail();
                if (email == null || email.equalsIgnoreCase(currentUser.getEmail())) continue;

                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

                TeamRole role = invite.getRole() == TeamRole.OWNER ? TeamRole.MEMBER : invite.getRole();
                invitationService.sendInvitation(team, user, currentUser, role != null ? role : TeamRole.MEMBER);
            }
        }

        return TeamMapper.toDto(team, members);
    }

    //đổi tên team
    public TeamResponse updateTeamName(String teamId, TeamUpdateRequest request, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);

        verifyIsOwner(team, currentUser);

        team.setTeamName(request.getNewName());
        if (request.getDescription() != null) {
            team.setDescription(request.getDescription());
        }
        teamRepository.save(team);

        return TeamMapper.toDto(team, getMembers(team));
    }

    //lấy tất cả thành viên team hiện tại đang tham gia
    public List<TeamResponse> getAllTeamsOfUser(User user) {
        List<TeamMember> memberships = teamMemberRepository.findAllByUser(user);
        List<TeamResponse> result = new ArrayList<>();
        for (TeamMember m : memberships) {
            TeamWorkspace team = m.getTeam();
            List<TeamMember> members = teamMemberRepository.findAllByTeam(team);
            result.add(TeamMapper.toDto(team, members));
        }
        return result;
    }

    //lấy thông tin team
    public TeamResponse getTeamDetail(String teamId, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsMember(team, currentUser);
        return TeamMapper.toDto(team, getMembers(team));
    }

    //rời nhóm
    public void leaveTeam(String teamId, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        TeamMember leavingMember = teamMemberRepository.findByTeamAndUser(team, currentUser)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_JOINED_ANY_TEAM));

        boolean isOwner = leavingMember.getTeamRole() == TeamRole.OWNER;
        long memberCount = teamMemberRepository.countByTeam(team);

        if (isOwner) {
            if (memberCount == 1) {
                // Chỉ có 1 người → xoá nhóm
                teamMemberRepository.delete(leavingMember);
                teamRepository.delete(team);
                return;
            }

            // Còn người khác → tự động chuyển quyền
            List<TeamMember> candidates = teamMemberRepository.findAllByTeam(team).stream()
                    .filter(m -> !m.getUser().getId().equals(currentUser.getId()))
                    .sorted(Comparator.comparing(BaseEntity::getCreatedAt))
                    .toList();

            TeamMember newOwner = candidates.get(0);
            newOwner.setTeamRole(TeamRole.OWNER);
            teamMemberRepository.save(newOwner);
        }

        teamMemberRepository.delete(leavingMember);
    }

    //kick khỏi nhóm
    @Transactional
    public void removeMember(String teamId, String userId, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsOwner(team, currentUser);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.CANNOT_KICK_SELF);
        }

        TeamMember member = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_TEAM));

        // ✅ Gỡ assign của member khỏi các task thuộc nhóm
        List<Task> tasksInTeam = taskRepo.findByColumn_Team(team);
        for (Task task : tasksInTeam) {
            if (task.getAssignees().contains(member)) {
                task.getAssignees().remove(member);
                taskRepo.save(task);
            }
        }

        // ✅ Xoá comment của user trong các task thuộc nhóm này
        List<TaskComment> commentsInTeam = taskCommentRepo.findByTask_Column_TeamAndCreatedBy(team, user);
        taskCommentRepo.deleteAll(commentsInTeam);

        // ✅ Xoá bản ghi team member
        teamMemberRepository.delete(member);
    }

    //xóa nhóm
    @Transactional
    public void deleteTeam(String teamId, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsOwner(team, currentUser);

        // 1. Lấy tất cả task của team
        List<Task> tasks = taskRepo.findByColumn_Team(team);

        for (Task task : tasks) {
            // 2. Lấy tất cả comment của task
            List<TaskComment> comments = taskCommentRepo.findAllByTask(task);

            for (TaskComment comment : comments) {
                // 3. Xóa liên kết visibleTo để dọn bảng trung gian
                comment.getVisibleTo().clear();
            }

            // 4. Xóa tất cả comment
            taskCommentRepo.deleteAll(comments);
        }

        // 5. Xóa tất cả task
        taskRepo.deleteAll(tasks);

        // 6. Xóa thành viên
        teamMemberRepository.deleteAllByTeam(team);
        teamInvitationRepo.deleteAllByTeam(team);
        notificationRepo.deleteAllByReferenceId(teamId);
        // 7. Xóa team
        teamRepository.delete(team);
    }

    // Helpers

    private TeamWorkspace findTeamOrThrow(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new AppException(ErrorCode.TEAM_NOT_FOUND));
    }

    private void verifyIsOwner(TeamWorkspace team, User user) {
        boolean isOwner = teamMemberRepository.existsByTeamAndUserAndTeamRole(team, user, TeamRole.OWNER);
        if (!isOwner) throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    private void verifyIsMember(TeamWorkspace team, User user) {
        boolean isMember = teamMemberRepository.existsByTeamAndUser(team, user);
        if (!isMember) throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    private List<TeamMember> getMembers(TeamWorkspace team) {
        return teamMemberRepository.findAllByTeam(team);
    }

    //mời vào nhóm có sẵn
    public void addMembersToTeam(String teamId, List<MemberInvite> invites, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsOwner(team, currentUser);
        validateTeamMemberLimit(team, invites.size());
        for (MemberInvite invite : invites) {
            String email = invite.getEmail();
            TeamRole role = invite.getRole();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Gọi hàm kiểm tra hoàn chỉnh
            // Kiểm tra thơi gian mời
            // Kiểm tra đã mời nhưng chưa phản hồi
            invitationService.validateInviteBeforeSending(team, user);

            // Nếu qua được kiểm tra → gửi lời mời
            invitationService.sendInvitation(team, user, currentUser,
                    role == TeamRole.OWNER ? TeamRole.MEMBER : (role != null ? role : TeamRole.MEMBER));
        }
    }

    //nhóm trưởng đổi vai trò thành viên
    public TeamResponse updateMemberRole(String teamId, String targetUserId, RoleUpdateRequest request, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsOwner(team, currentUser);

        if (targetUserId.equals(currentUser.getId())) {
            throw new AppException(ErrorCode.CANNOT_CHANGE_OWN_ROLE);
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        TeamMember member = teamMemberRepository.findByTeamAndUser(team, targetUser)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_TEAM));

        if (request.getNewRole() == TeamRole.OWNER) {
            TeamMember owner = teamMemberRepository.findByTeamAndUser(team, currentUser)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_TEAM));
            owner.setTeamRole(TeamRole.MEMBER);
            teamMemberRepository.save(owner);
        }

        member.setTeamRole(
                request.getNewRole() == TeamRole.OWNER ? TeamRole.OWNER : TeamRole.MEMBER
        );
        teamMemberRepository.save(member);

        List<TeamMember> members = teamMemberRepository.findAllByTeam(team);
        return TeamMapper.toDto(team, members);
    }

    // Ngày dựa trên khoảng cách hiện tại
    public List<InvitationResponse> getSentInvitations(String teamId, User currentUser) {
        TeamWorkspace team = findTeamOrThrow(teamId);
        verifyIsOwner(team, currentUser);

        List<TeamInvitation> invites = invitationRepository.findAllByTeam(team);

        return invites.stream().map(invite ->
                new InvitationResponse(
                        team.getId(),
                        team.getTeamName(),
                        invite.getInvitedRole(),
                        invite.getStatus(),
                        invite.getInvitedUser().getEmail(),
                        invite.getCreatedAt(), // hoặc gọi timeAgo(invite.getCreatedAt()) nếu muốn kiểu "3 ngày trước"
                        TimeUtils.timeAgo(invite.getCreatedAt())
                )
        ).toList();
    }

    public TeamWorkspace getTeamByIdOrThrow(String id) {
        return findTeamOrThrow(id);
    }

    //attachments
    public List<AttachmentDTO> getAllAttachmentsInTeam(String teamId, AttachmentType typeFilter) {
        List<Attachment> attachments = attachmentRepository.findByTeamId(teamId, typeFilter);
        return attachments.stream().map(attachmentMapper::toDto).toList();
    }
}