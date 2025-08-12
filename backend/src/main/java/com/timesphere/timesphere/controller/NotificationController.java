package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.service.DeadlineReminderService;
import com.timesphere.timesphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final DeadlineReminderService deadlineReminderService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> getMyNotifications(@AuthenticationPrincipal User user) {
        var notis = notificationService.getNotificationsOfUser(user);
        return ResponseEntity.ok(ApiResponse.success("Danh sách thông báo", notis));
    }

    //xóa
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> deleteNotification(
            @PathVariable String notificationId,
            @AuthenticationPrincipal User user
    ) {
        notificationService.deleteNotification(notificationId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã xoá thông báo."));
    }

    //xóa tất cả
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> deleteAllNotifications(@AuthenticationPrincipal User user) {
        notificationService.deleteAllOfUser(user);
        return ResponseEntity.ok(ApiResponse.success("Đã xoá tất cả thông báo."));
    }

    //đánh dấu từng thông báo
    @PostMapping("/{notificationId}/read")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> markAsRead(
            @PathVariable String notificationId,
            @AuthenticationPrincipal User user
    ) {
        notificationService.markAsRead(notificationId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu đã đọc."));
    }

    //đánh dấu đọc tất cả
    @PostMapping("/read-all")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> markAllAsRead(
            @AuthenticationPrincipal User user
    ) {
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu tất cả đã đọc."));
    }

    //đánh dấu chưa đọc
    @PostMapping("/{notificationId}/unread")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> markAsUnread(
            @PathVariable String notificationId,
            @AuthenticationPrincipal User user
    ) {
        notificationService.markAsUnread(notificationId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu chưa đọc."));
    }

    //kiểm tra thông báo từ hệ thống
    @PostMapping("/test-remind-deadline")
    @PreAuthorize("hasAuthority('user:read_notification')")
    public ResponseEntity<?> testReminder(@AuthenticationPrincipal User user) {
        deadlineReminderService.remindTasksDueSoon();
        return ResponseEntity.ok(ApiResponse.success("Đã chạy logic nhắc deadline thủ công"));
    }
}