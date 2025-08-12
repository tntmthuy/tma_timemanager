package com.timesphere.timesphere.entity.type;

public enum NotificationType {
    INVITE,
    JOIN_TEAM,
    TASK_ASSIGNED,         // 📌 Bạn được gán vào task
    COMMENT_PRIVATE,       // 🔒 Có bình luận riêng gửi cho bạn
    COMMENT_PUBLIC,        // 💬 Có bình luận công khai trong task
    DEADLINE_REMINDER      // ⏰ Task sắp đến hạn (tự động)
}
