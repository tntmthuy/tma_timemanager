package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.service.TeamInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamInvitationController {

    private final TeamInvitationService invitationService;

    // Gửi lời mời
    @GetMapping()
    public ResponseEntity<?> getMyInvites(@AuthenticationPrincipal User user) {
        var invites = invitationService.getPendingInvitations(user);
        return ResponseEntity.ok(ApiResponse.success("Danh sách lời mời", invites));
    }

    @PostMapping("/{teamId}/accept")
    public ResponseEntity<?> accept(@PathVariable String teamId, @AuthenticationPrincipal User user) {
        invitationService.acceptInvitation(teamId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã tham gia nhóm thành công!"));
    }

    @PostMapping("/{teamId}/decline")
    public ResponseEntity<?> decline(@PathVariable String teamId, @AuthenticationPrincipal User user) {
        invitationService.declineInvitation(teamId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã từ chối lời mời."));
    }
}
