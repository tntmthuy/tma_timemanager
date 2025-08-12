package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.dto.kanban.*;
import com.timesphere.timesphere.dto.member.AssignTaskRequest;
import com.timesphere.timesphere.dto.member.TeamMemberDTO;
import com.timesphere.timesphere.dto.subtask.*;
import com.timesphere.timesphere.dto.task.*;
import com.timesphere.timesphere.entity.KanbanColumn;
import com.timesphere.timesphere.entity.Task;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.mapper.KanbanColumnMapper;
import com.timesphere.timesphere.mapper.TaskMapper;
import com.timesphere.timesphere.service.KanbanService;
import com.timesphere.timesphere.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kanban")
@CrossOrigin(origins = "http://localhost:5173")
public class KanbanController {

    private final KanbanService kanbanService;
    private final TaskService taskService;

    @PreAuthorize("hasAuthority('user:manage_board')")
    @GetMapping("/{workspaceId}/kanban-board")
    public ResponseEntity<?> getBoard(@PathVariable String workspaceId) {
        KanbanBoardResponseDTO dto = kanbanService.getKanbanBoard(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Lấy Kanban board thành công!", dto));
    }

    // 🎏Column
    @PostMapping("/column")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> createColumn(@Valid @RequestBody CreateColumnRequest req,
                                          @AuthenticationPrincipal User currentUser) {
        KanbanColumn column = kanbanService.createColumn(req, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tạo column thành công!", KanbanColumnMapper.toDto(column)));
    }

    @DeleteMapping("/column/{columnId}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> deleteColumn(
            @PathVariable String columnId,
            @AuthenticationPrincipal User currentUser
    ) {
        kanbanService.deleteColumnById(columnId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Xoá column thành công!"));
    }

    // đổi tiêu đề column - OWNER
    @PatchMapping("/column/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> updateColumn(
            @PathVariable String id,
            @RequestBody UpdateColumnRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        KanbanColumn updated = kanbanService.updateColumnTitle(id, req.getTitle(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật tiêu đề column!", KanbanColumnMapper.toDto(updated)));
    }

    // di chuyển column - OWNER
    @PutMapping("/column/{id}/move")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> moveColumn(
            @PathVariable String id,
            @RequestBody MoveColumnRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        KanbanColumn updated = kanbanService.moveColumnToPosition(id, req.getTargetPosition(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Dời column thành công!", KanbanColumnMapper.toDto(updated)));
    }

    // 🎎Task
    @PostMapping("/task")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> createTask(@Valid @RequestBody CreateTaskRequest req,
                                        @AuthenticationPrincipal User currentUser) {
        Task task = taskService.createTask(req, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tạo task thành công!", TaskMapper.toDto(task)));
    }

    @GetMapping("/task/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết task thành công!", taskService.getTaskById(id)));
    }

    //task đuược gán
    @GetMapping("/tasks/assigned-to-me")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<ApiResponse<List<AssignedTaskSummary>>> getMyTasks(
            @AuthenticationPrincipal User user
    ) {
        List<AssignedTaskSummary> result = taskService.getMyAssignedTasks(user);
        return ResponseEntity.ok(ApiResponse.success("Nhiệm vụ đang được giao", result));
    }

    // gán task
    @PutMapping("/task/{taskId}/assign")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> assignTask(
            @PathVariable String taskId,
            @Valid @RequestBody AssignTaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponseDTO updated = taskService.assignMembers(taskId, req.getMemberIds(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Gán thành viên vào task thành công!", updated));
    }

    //unassign
    @PutMapping("/task/{taskId}/unassign")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> unassignTaskMembers(
            @PathVariable String taskId,
            @Valid @RequestBody AssignTaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponseDTO updated = taskService.unassignMembers(taskId, req.getMemberIds(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Gỡ thành viên khỏi task thành công!", updated));
    }

    //list assignees
    @GetMapping("/task/{taskId}/assignees")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> getTaskAssignees(
            @PathVariable String taskId,
            @AuthenticationPrincipal User currentUser
    ) {
        List<TeamMemberDTO> assignees = taskService.getAssigneesOfTask(taskId, currentUser);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách thành viên được giao thành công!", assignees)
        );
    }

    // cập nhật task
    @PatchMapping("/task/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> updateTask(
            @PathVariable String id,
            @RequestBody UpdateTaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponseDTO updated = taskService.updateTask(id, req, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nội dung task thành công!", updated));
    }

    // xóa task
    @DeleteMapping("/task/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> deleteTask(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Đã xoá task thành công!"));
    }

    //dời task
    @PutMapping("/task/{taskId}/move-column")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> moveTaskColumn(
            @PathVariable String taskId,
            @RequestBody MoveTaskToColumnRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponseDTO updated = taskService.moveTaskToColumnAtPosition(
                taskId,
                req.getTargetColumnId(),
                req.getTargetPosition(),
                currentUser // 👈 Truyền đúng user đang thao tác
        );

        return ResponseEntity.ok(ApiResponse.success("Đã chuyển task về column mới!", updated));
    }


    // 🎈SUBTASK
    // Tạo sub
    @PostMapping("/task/subtask")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> createSubtask(
            @RequestBody CreateSubtaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        Task sub = taskService.createSubtask(req, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tạo subtask thành công!", TaskMapper.toSubtaskDto(sub)));
    }

    //tạo nhiều subtasks
    @PostMapping("/task/subtask/bulk")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> createMultipleSubtasks(
            @RequestBody CreateMultipleSubtaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        List<SubtaskDTO> dtos = taskService.createAndReturnSubtaskDtos(req.getTitles(), req.getParentTaskId(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tạo nhiều subtask thành công!", dtos));
    }

    // ✅ Đánh dấu trạng thái hoàn thành
    @PutMapping("/task/subtask/{id}/toggle-complete")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> toggleSubtask(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.toggleSubtaskStatus(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái subtask thành công!"));
    }

    // 🔀 Dời vị trí subtask
    @PutMapping("/task/{parentId}/subtasks/reorder")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> reorderSubtask(
            @PathVariable String parentId,
            @RequestBody ReorderSubtaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.reorderSubtask(parentId, req.getSubtaskId(), req.getTargetPosition(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Sắp xếp lại subtask thành công!"));
    }

    // 📝 Cập nhật nội dung subtask
    @PatchMapping("/task/subtask/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> updateSubtask(
            @PathVariable String id,
            @Valid @RequestBody UpdateSubtaskRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.updateSubtaskTitle(id, req.getTitle(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nội dung subtask thành công!"));
    }

    // ❌ Xóa subtask
    @DeleteMapping("/task/subtask/{id}")
    @PreAuthorize("hasAuthority('user:manage_board')")
    public ResponseEntity<?> deleteSubtask(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.deleteSubtask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Xoá subtask thành công!"));
    }

}