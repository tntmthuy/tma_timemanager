package com.timesphere.timesphere.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttachmentDTO {
    private String id;
    private String name;
    private String url;
    private String fileType;
    private String type;    // IMAGE hoặc FILE
    private Long size;      // Dung lượng tính theo byte
    private String displaySize; // VD: "2.3 MB"
    private String uploadedByName;  // 👤 người upload
    private String uploadedByAvatar; // optional nếu FE hiển thị avatar
    private LocalDateTime createdAt; // 🕒 ngày tạo file
    private String taskTitle; // optional nếu FE muốn group theo task
}
