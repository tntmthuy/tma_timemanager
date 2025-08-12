package com.timesphere.timesphere.dto.subtask;

import lombok.Data;

import java.util.List;

@Data
public class CreateMultipleSubtaskRequest {
    private String parentTaskId;
    private List<String> titles;
}
