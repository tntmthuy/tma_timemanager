package com.timesphere.timesphere.dto.admin;

import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.entity.type.UserStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDto {
    private String id;
    private String email;
    private String fullName;
    private Role role;
    private UserStatus status;
    private String createdAt;
}