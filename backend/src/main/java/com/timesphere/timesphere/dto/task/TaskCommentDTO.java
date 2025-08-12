package com.timesphere.timesphere.dto.task;

import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.entity.type.CommentVisibility;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskCommentDTO {
    private String id;
    private String content;
    private String createdById;
    private String createdByName;
    private String createdByAvatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CommentVisibility visibility;
    private List<String> visibleToUserIds;

    private List<AttachmentDTO> attachments;
}