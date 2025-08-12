package com.timesphere.timesphere.entity.type;

public enum UserStatus {
    ACTIVE,     // Đang sử dụng bình thường, đăng nhập và thao tác được
    INACTIVE,   // Đã bị tắt/bỏ kích hoạt — có thể là chưa xác thực hoặc tự đóng tài khoản
    BLOCKED     // Bị admin chặn do vi phạm, không đăng nhập hoặc thao tác được
}
