package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.noti.NotificationDTO;
import com.timesphere.timesphere.entity.Notification;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.NotificationType;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.mapper.NotificationMapper;
import com.timesphere.timesphere.repository.NotificationRepository;
import com.timesphere.timesphere.repository.TeamInvitationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final NotificationMapper mapper;
    private final TeamInvitationRepository invitationRepository;

    public List<NotificationDTO> getNotificationsOfUser(User user) {
        List<Notification> list = notificationRepo.findByRecipientOrderByCreatedAtDesc(user);
        return list.stream().map(mapper::toDto).toList();
    }

    public void notify(User recipient, User sender, String title, String content, String url, NotificationType type, String referenceId) {
        System.out.println("📝 Saving notification: " + type + " → " + recipient.getEmail());
        Notification noti = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .title(title)
                .content(content)
                .targetUrl(url)
                .type(type)
                .isRead(false)
                .referenceId(referenceId)
                .build();
        notificationRepo.save(noti);
    }

    //xóa
    @Transactional
    public void deleteNotification(String notificationId, User user) {
        Notification noti = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (noti.getType() == NotificationType.INVITE && noti.getReferenceId() != null) {
            invitationRepository.deleteByTeamIdAndInvitedUserId(noti.getReferenceId(), user.getId());
        }

        notificationRepo.delete(noti);
    }

    //xóa tất cả
    @Transactional
    public void deleteAllOfUser(User user) {
        List<Notification> allNotis = notificationRepo.findByRecipient(user);
        allNotis.forEach(noti -> {
            if (noti.getType() == NotificationType.INVITE && noti.getReferenceId() != null) {
                invitationRepository.deleteByTeamIdAndInvitedUserId(noti.getReferenceId(), user.getId());
            }
        });
        notificationRepo.deleteAll(allNotis);
    }

    //đánh dấu đã đọc 1 cái
    public void markAsRead(String notificationId, User user) {
        Notification noti = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!noti.getRecipient().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        noti.setRead(true);
        notificationRepo.save(noti);
    }

    //đánh dấu đã đọc tất cả
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepo.markAllAsRead(user.getId());
    }

    //đánh dấu chưa đọc
    @Transactional
    public void markAsUnread(String notificationId, User user) {
        Notification noti = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!noti.getRecipient().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        noti.setRead(false);
        notificationRepo.save(noti);
    }
}