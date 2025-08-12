package com.timesphere.timesphere.dto.comment;

import com.timesphere.timesphere.entity.type.CommentVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateCommentRequest {

    @NotBlank(message = "Nội dung bình luận không được để trống.")
    private String content;

    @NotNull(message = "ID task không được để trống.")
    private String taskId;

    // Nếu để null → mặc định PUBLIC
    private CommentVisibility visibility;

    // Nếu visibility = PRIVATE → gắn userIds
    private List<String> visibleToUserIds;

    // (Tuỳ chọn) Mã file tạm nếu bạn gửi file trước (dùng Multipart upload)
    private List<AttachmentDTO> attachments;
}
