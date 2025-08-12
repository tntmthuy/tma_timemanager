package com.timesphere.timesphere.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class ChangePasswordRequest {

    @NotBlank(message = "CURRENT_PASSWORD_REQUIRED")
    private String currentPassword;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Pattern(
            regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*#?&]).{8,}$",
            message = "PASSWORD_TOO_WEAK"
    )
    private String newPassword;

    @NotBlank(message = "CONFIRMATION_PASSWORD_REQUIRED")
    private String confirmationPassword;
}
