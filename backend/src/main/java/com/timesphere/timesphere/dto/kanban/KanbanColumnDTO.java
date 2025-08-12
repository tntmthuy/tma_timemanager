package com.timesphere.timesphere.dto.kanban;

import com.timesphere.timesphere.dto.task.TaskResponseDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KanbanColumnDTO {
    private String id;
    private String title;
    private Integer position;
    private List<TaskResponseDTO> tasks;
}
