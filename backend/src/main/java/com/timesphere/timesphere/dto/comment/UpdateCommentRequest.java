package com.timesphere.timesphere.dto.comment;

import lombok.Data;

import java.util.List;

@Data
public class UpdateCommentRequest {
    private String content;
    private List<String> attachmentIdsToKeep;
}
