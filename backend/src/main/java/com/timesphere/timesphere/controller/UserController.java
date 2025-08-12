package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ChangePasswordRequest;
import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.dto.user.ChangeAvatarRequest;
import com.timesphere.timesphere.dto.user.UpdateProfileRequest;
import com.timesphere.timesphere.dto.user.UserProfileResponse;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.service.TeamInvitationService;
import com.timesphere.timesphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TeamInvitationService invitationService;

    // Đổi mật khẩu khi đã đăng nhập
    @PatchMapping("/change-password")
    @PreAuthorize("hasAuthority('user:manage_profile')")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal connectUser
    ) {
        userService.changePassword(request, connectUser);
        return ResponseEntity.ok(
                ApiResponse.success("Đổi mật khẩu thành công!")
        );
    }

    @GetMapping("/search-invitable")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> searchInvitableUsers(
            @RequestParam String keyword,
            @RequestParam String teamId
    ) {
        var result = invitationService.searchUsersForInvitation(keyword, teamId);
        return ResponseEntity.ok(ApiResponse.success("Gợi ý thành viên khả dụng", result));
    }

    @GetMapping("/search-new-team")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<?> suggestForNewTeam(@RequestParam(required = false) String keyword) {
        var suggestions = userService.searchUsersForNewTeam(keyword);
        return ResponseEntity.ok(ApiResponse.success("Gợi ý thành viên khả dụng", suggestions));
    }

    //cập nhật profile
    @PatchMapping("/profile")
    @PreAuthorize("hasAuthority('user:manage_profile')")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        User updated = userService.updateProfile(currentUser, req);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật hồ sơ cá nhân!", UserProfileResponse.from(updated)));
    }

    //avatar
    @PatchMapping("/avatar")
    @PreAuthorize("hasAuthority('user:manage_profile')")
    public ResponseEntity<?> changeAvatar(
            @RequestBody ChangeAvatarRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        User updated = userService.changeAvatar(currentUser, req.getAvatarUrl());
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật avatar!", UserProfileResponse.from(updated)));
    }

    //lấy thông tin
    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('user:manage_profile')")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                ApiResponse.success("Thông tin hồ sơ cá nhân", UserProfileResponse.from(currentUser))
        );
    }
}