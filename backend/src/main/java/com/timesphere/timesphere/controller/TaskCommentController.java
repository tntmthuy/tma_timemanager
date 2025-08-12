package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.dto.comment.CreateCommentRequest;
import com.timesphere.timesphere.dto.comment.UpdateCommentRequest;
import com.timesphere.timesphere.dto.task.TaskCommentDTO;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.service.TaskCommentService;
import com.timesphere.timesphere.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskCommentController {

    private final TaskCommentService commentService;
    private final TeamService teamService;

    @PostMapping("/task")
    @PreAuthorize("hasAuthority('user:task_comment')")
    public ResponseEntity<ApiResponse<TaskCommentDTO>> createComment(@Valid @RequestBody CreateCommentRequest req) {
        TaskCommentDTO result = commentService.createComment(req);
        return ResponseEntity.ok(ApiResponse.success("Gửi bình luận thành công!", result));
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAuthority('user:task_comment')")
    public ResponseEntity<ApiResponse<List<TaskCommentDTO>>> getCommentsByTask(@PathVariable String taskId) {
        List<TaskCommentDTO> result = commentService.getCommentsByTask(taskId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách bình luận thành công!", result));
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasAuthority('user:task_comment')")
    public ResponseEntity<ApiResponse<TaskCommentDTO>> updateComment(
            @PathVariable String commentId,
            @RequestPart("data") UpdateCommentRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> newFiles,
            @AuthenticationPrincipal User currentUser) {

        TaskCommentDTO updated = commentService.updateComment(
                commentId,
                currentUser,
                request.getContent(),
                newFiles != null ? newFiles : List.of()
        );

        return ResponseEntity.ok(ApiResponse.success("Cập nhật bình luận thành công!", updated));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAuthority('user:task_comment')")
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal User currentUser
    ) {
        // B1: Xoá bình luận và trả về teamId
        String teamId = commentService.deleteComment(commentId, currentUser);

        // B2: Gọi lại danh sách file đính kèm còn lại của team
        List<AttachmentDTO> remainingFiles = teamService.getAllAttachmentsInTeam(teamId, null);

        // B3: Trả về phản hồi có code + message + data
        return ResponseEntity.ok(
                ApiResponse.success("Đã xoá bình luận thành công!", remainingFiles)
        );
    }
}
