package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.dto.member.TeamMemberDTO;
import com.timesphere.timesphere.dto.task.CalendarDayResponse;
import com.timesphere.timesphere.dto.team.*;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.AttachmentType;
import com.timesphere.timesphere.service.TeamCalendarService;
import com.timesphere.timesphere.service.TeamMemberService;
import com.timesphere.timesphere.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamService teamService;
    private final TeamMemberService teamMemberService;
    private final TeamCalendarService teamCalendarService;

    @PostMapping
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> createTeam(
            @Valid @RequestBody TeamCreateRequest request,
            @AuthenticationPrincipal User user) {
        TeamResponse response = teamService.createTeam(request, user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo nhóm thành công!", response));
    }

    @PutMapping("/{teamId}/name")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> renameTeam(
            @PathVariable String teamId,
            @Valid @RequestBody TeamUpdateRequest request,
            @AuthenticationPrincipal User user
    ) {
        TeamResponse updated = teamService.updateTeamName(teamId, request, user);
        return ResponseEntity.ok(ApiResponse.success("Đổi tên nhóm thành công!", updated));
    }

    //mời thêm thành viên
    @PostMapping("/{teamId}/members")
    public ResponseEntity<?> addMembers(
            @PathVariable String teamId,
            @Valid @RequestBody List<@Valid MemberInvite> invites,
            @AuthenticationPrincipal User currentUser
    ) {
        teamService.addMembersToTeam(teamId, invites, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Đã gửi lời mời thành công!"));
    }

    //lấy danh sách thành viên nhóm hiện tại (thông tin tổng quan)
    @GetMapping("/{teamId}")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> getTeamDetail(
            @PathVariable String teamId,
            @AuthenticationPrincipal User user
    ) {
        TeamResponse response = teamService.getTeamDetail(teamId, user);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nhóm thành công!", response));
    }

    //lấy các nhóm đang tham gia
    @GetMapping
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> getAllTeams(
            @AuthenticationPrincipal User user
    ) {
        List<TeamResponse> teams = teamService.getAllTeamsOfUser(user);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhóm thành công!", teams));
    }

    //rời nhóm
    @DeleteMapping("/{teamId}/leave")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> leaveTeam(
            @PathVariable String teamId,
            @AuthenticationPrincipal User user
    ) {
        teamService.leaveTeam(teamId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã rời khỏi nhóm!"));
    }

    //kick khỏi nhóm
    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> removeMember(
            @PathVariable String teamId,
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser
    ) {
        teamService.removeMember(teamId, userId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Đã xoá thành viên khỏi nhóm!"));
    }

    //xóa nhóm
    @DeleteMapping("/{teamId}")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> deleteTeam(
            @PathVariable String teamId,
            @AuthenticationPrincipal User user
    ) {
        teamService.deleteTeam(teamId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã xoá nhóm thành công!"));
    }

    //nhóm trưởng đổi vai trò thành viên
    @PutMapping("/{teamId}/members/{userId}/role")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> updateMemberRole(
            @PathVariable String teamId,
            @PathVariable String userId,
            @Valid @RequestBody RoleUpdateRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        TeamResponse updatedTeam = teamService.updateMemberRole(teamId, userId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật vai trò thành công!", updatedTeam));
    }

    // Tìm kiếm thanh viên trong team
    @GetMapping("/{teamId}/members/search")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> searchTeamMembers(
            @PathVariable String teamId,
            @RequestParam(required = false) String keyword,
            @AuthenticationPrincipal User currentUser
    ) {
        String safeKeyword = keyword == null ? "" : keyword.trim();
        var result = teamMemberService.searchMembersInTeam(teamId, safeKeyword, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Gợi ý thành viên phù hợp", result));
    }

    //Member
    // Lấy danh sách thành viên nhóm với các thong tin cơ bản
    @GetMapping("/{teamId}/members")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> getTeamMembers(
            @PathVariable String teamId,
            @AuthenticationPrincipal User currentUser
    ) {
        TeamWorkspace team = teamService.getTeamByIdOrThrow(teamId); // có thể tạo sẵn hàm này để dùng chung
        List<TeamMemberDTO> members = teamMemberService.getMembersOfTeam(teamId, currentUser, team);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành viên thành công!", members));
    }

    //all attachments of team
    @GetMapping("/{teamId}/attachments")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByTeam(
            @PathVariable String teamId,
            @RequestParam(required = false) AttachmentType type
    ) {
        List<AttachmentDTO> files = teamService.getAllAttachmentsInTeam(teamId, type);
        return ResponseEntity.ok(files);
    }

    //lịch
    @GetMapping("/{teamId}/calendar")
    @PreAuthorize("hasAuthority('premium:get_calendar')")
    public ResponseEntity<?> getCalendar(@PathVariable String teamId) {
        List<CalendarDayResponse> days = teamCalendarService.getCalendarByTeam(teamId);

        return ResponseEntity.ok(Map.of(
                "teamId", teamId,
                "days", days
        ));
    }

}