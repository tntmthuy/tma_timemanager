package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.kanban.KanbanColumnDTO;
import com.timesphere.timesphere.dto.task.TaskResponseDTO;
import com.timesphere.timesphere.entity.KanbanColumn;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class KanbanColumnMapper {

    public static KanbanColumnDTO toDto(KanbanColumn column) {
        List<TaskResponseDTO> taskDtos = Optional.ofNullable(column.getTasks())
                .orElse(List.of())
                .stream()
                .map(TaskMapper::toDto)
                .sorted(Comparator.comparing(TaskResponseDTO::getPosition)) // ✅ sort theo vị trí
                .toList();

        return KanbanColumnDTO.builder()
                .id(column.getId())
                .title(column.getTitle())
                .position(column.getPosition())
                .tasks(taskDtos)
                .build();
    }

}
