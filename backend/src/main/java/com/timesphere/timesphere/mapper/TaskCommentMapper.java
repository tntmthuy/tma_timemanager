package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.task.TaskCommentDTO;
import com.timesphere.timesphere.entity.TaskComment;
import com.timesphere.timesphere.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TaskCommentMapper {

    private final AttachmentMapper attachmentMapper;

    public TaskCommentDTO toDto(TaskComment comment) {
        User createdBy = comment.getCreatedBy();

        return TaskCommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .createdById(createdBy.getId())
                .createdByName(createdBy.getFullName())
                .createdByAvatar(createdBy.getAvatarUrl())
                .visibility(comment.getVisibility())
                .visibleToUserIds(
                        comment.getVisibleTo() != null
                                ? comment.getVisibleTo().stream().map(User::getId).toList()
                                : List.of()
                )
                .attachments(
                        comment.getAttachments() != null
                                ? comment.getAttachments().stream()
                                .map(attachmentMapper::toDto)
                                .toList()
                                : List.of()
                )
                .build();
    }
}
