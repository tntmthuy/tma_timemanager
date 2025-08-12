package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.kanban.KanbanBoardResponseDTO;
import com.timesphere.timesphere.dto.kanban.KanbanColumnDTO;
import com.timesphere.timesphere.entity.KanbanColumn;
import com.timesphere.timesphere.entity.TeamWorkspace;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class KanbanBoardMapper {

    public static KanbanBoardResponseDTO toDto(TeamWorkspace workspace) {
        List<KanbanColumnDTO> columnDtos = Optional.ofNullable(workspace.getColumns())
                .orElse(Set.of()) // vì columns là Set → dùng Set.of()
                .stream()
                .map(KanbanColumnMapper::toDto)
                .sorted(Comparator.comparing(KanbanColumnDTO::getPosition)) // ✅ sắp theo position
                .toList();

        return KanbanBoardResponseDTO.builder()
                .workspaceId(workspace.getId())
                .workspaceName(workspace.getTeamName())
                .columns(columnDtos)
                .build();
    }
}
