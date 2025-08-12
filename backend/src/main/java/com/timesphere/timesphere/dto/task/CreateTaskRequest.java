package com.timesphere.timesphere.dto.task;

import com.timesphere.timesphere.entity.type.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskRequest {
    private String columnId;      // ID của KanbanColumn mà task nằm trong


    @NotBlank(message = "Tiêu đề subtask không được để trống.")
    private String title;         // Tên task
    private String description;   // Mô tả task (optional)
    private Integer position;     // Vị trí trong cột (FE kéo thả sẽ truyền)
    private LocalDateTime dateDue;
    private Priority priority;    // Enum: LOW, MEDIUM, HIGH
}
