package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.noti.NotificationDTO;
import com.timesphere.timesphere.entity.Notification;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.type.InviteStatus;
import com.timesphere.timesphere.entity.type.NotificationType;
import com.timesphere.timesphere.repository.TeamInvitationRepository;
import com.timesphere.timesphere.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationMapper {

    public final TeamInvitationRepository invitationRepository;

    public NotificationDTO toDto(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .type(n.getType().name())
                .targetUrl(n.getTargetUrl())
                .isRead(n.isRead())
                .senderName(n.getSender() != null ? n.getSender().getFullName() : "Hệ thống")
                .senderAvatar(n.getSender() != null ? n.getSender().getAvatarUrl() : null)
                .timeAgo(TimeUtils.timeAgo(n.getCreatedAt()))
                .createdAt(n.getCreatedAt())
                .referenceId(n.getReferenceId()) //taskId
                .inviteStatus(getInviteStatus(n))
                .build();
    }

    private InviteStatus getInviteStatus(Notification n) {
        if (n.getType() != NotificationType.INVITE || n.getReferenceId() == null) return null;

        return invitationRepository
                .findTopByTeamAndInvitedUserOrderByCreatedAtDesc(
                        TeamWorkspace.builder().id(n.getReferenceId()).build(),
                        n.getRecipient()
                )
                .map(invite -> InviteStatus.valueOf(invite.getStatus().name()))
                .orElse(null);
    }

}
