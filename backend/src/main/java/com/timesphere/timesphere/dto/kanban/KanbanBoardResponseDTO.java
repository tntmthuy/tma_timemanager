package com.timesphere.timesphere.dto.kanban;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KanbanBoardResponseDTO {
    private String workspaceId;
    private String workspaceName;
    private List<KanbanColumnDTO> columns;
}
