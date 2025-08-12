package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.subtask.SubtaskDTO;
import com.timesphere.timesphere.dto.task.TaskResponseDTO;
import com.timesphere.timesphere.entity.Task;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TaskMapper {

    public static SubtaskDTO toSubtaskDto(Task task) {
        return SubtaskDTO.builder()
                .id(task.getId())
                .title(task.getTaskTitle())
                .isComplete(Boolean.TRUE.equals(task.getIsComplete()))
                .subtaskPosition(task.getSubtaskPosition())
                .build();
    }

    public static TaskResponseDTO toDto(Task task) {
        List<SubtaskDTO> subtaskDtos = Optional.ofNullable(task.getSubTasks())
                .orElse(List.of())
                .stream()
                .map(sub -> SubtaskDTO.builder()
                        .id(sub.getId())
                        .title(sub.getTaskTitle())
                        .isComplete(Boolean.TRUE.equals(sub.getIsComplete()))
                        .subtaskPosition(sub.getSubtaskPosition())
                        .build())
                .toList();

        double progress = 0.0;
        String progressDisplay = "0/0";

        if (!subtaskDtos.isEmpty()) {
            long done = subtaskDtos.stream()
                    .filter(s -> Boolean.TRUE.equals(s.getIsComplete()))
                    .count();

            progress = Math.round((double) done / subtaskDtos.size() * 100.0) / 100.0;
            progressDisplay = done + "/" + subtaskDtos.size();
        }

        return TaskResponseDTO.builder()
                .id(task.getId())
                .taskTitle(task.getTaskTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .position(task.getPosition())
                .dateDue(task.getDateDue())
                .subTasks(subtaskDtos)
                .progress(progress)
                .progressDisplay(progressDisplay)
                .assignees(Optional.ofNullable(task.getAssignees())
                        .orElse(new ArrayList<>())
                        .stream()
                        .map(TaskAssigneeMapper::toDto)
                        .toList())
                .build();
    }

    public static List<TaskResponseDTO> toDtoList(List<Task> tasks) {
        return Optional.ofNullable(tasks)
                .orElse(List.of())
                .stream()
                .map(TaskMapper::toDto)
                .toList();
    }
}