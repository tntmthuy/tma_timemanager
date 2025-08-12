package com.timesphere.timesphere.dto.team;

import com.timesphere.timesphere.entity.type.TeamRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberInvite {
    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "EMAIL_INVALID")
    private String email;

//    @NotNull(message = "ROLE_REQUIRED")
    private TeamRole role;
    // OWNER hoặc MEMBER
}