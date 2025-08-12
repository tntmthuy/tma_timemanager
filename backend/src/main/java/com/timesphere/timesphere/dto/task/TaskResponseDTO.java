package com.timesphere.timesphere.dto.task;

import com.timesphere.timesphere.dto.subtask.SubtaskDTO;
import com.timesphere.timesphere.entity.type.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskResponseDTO {
    private String id;
    private String taskTitle;
    private String description;
    private Priority priority;
    private Integer position;
    private LocalDateTime dateDue;
    private List<TaskAssigneeDTO> assignees;
    private List<SubtaskDTO> subTasks;

    private Double progress;         // Tỷ lệ hoàn thành dạng thập phân (0.0 → 1.0)
    private String progressDisplay; // Ví dụ: "3/7" - để UI hiển thị cạnh progress bar
}
