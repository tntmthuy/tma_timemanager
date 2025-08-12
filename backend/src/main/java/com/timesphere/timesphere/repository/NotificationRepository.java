package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.Notification;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User user);

    //đánh đấu đã đọc khi decline hay accept
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.id = :userId AND n.referenceId = :teamId AND n.type = :type")
    void markAsReadByUserAndTeam(String userId, String teamId, NotificationType type);

    //đánh dấu đã đọc tất cả
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.id = :userId AND n.isRead = false")
    void markAllAsRead(String userId);

    // xóa tất cả
    List<Notification> findByRecipient(User user);

    // hệ thống báo
    boolean existsByTypeAndReferenceIdAndRecipientId(NotificationType type, String referenceId, String recipientId);

    // xóa thông báo từ team
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.referenceId = :teamId")
    void deleteAllByReferenceId(String teamId);
}