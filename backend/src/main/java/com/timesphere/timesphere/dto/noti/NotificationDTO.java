package com.timesphere.timesphere.dto.noti;

import com.timesphere.timesphere.entity.type.InviteStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private String id;
    private String title;
    private String content;
    private String type;
    private String targetUrl;
    private boolean isRead;
    private String senderName;
    private String senderAvatar;
    private String timeAgo;
    private LocalDateTime createdAt;
    private String referenceId;
    private InviteStatus inviteStatus;
}