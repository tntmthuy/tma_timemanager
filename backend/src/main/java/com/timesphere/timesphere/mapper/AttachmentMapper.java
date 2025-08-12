package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.entity.Attachment;
import com.timesphere.timesphere.entity.TaskComment;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.util.FileUtils;
import org.springframework.stereotype.Component;

@Component
public class AttachmentMapper {

    public AttachmentDTO toDto(Attachment attachment) {
        TaskComment comment = attachment.getComment();
        User createdBy = comment.getCreatedBy();

        return AttachmentDTO.builder()
                .id(attachment.getId())
                .name(attachment.getName())
                .url(attachment.getUrl())
                .fileType(attachment.getFileType())
                .type(attachment.getType().name())
                .size(attachment.getSize())
                .displaySize(FileUtils.formatSize(
                        attachment.getSize() != null ? attachment.getSize() : 0L))

                // 👤 Người upload
                .uploadedByName(createdBy != null ? createdBy.getFullName() : "Ẩn danh")
                .uploadedByAvatar(createdBy != null ? createdBy.getAvatarUrl() : null)

                // 🕒 Thời điểm tạo file (theo comment)
                .createdAt(comment.getCreatedAt())

                .build();
    }
}