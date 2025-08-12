package com.timesphere.timesphere.dto.user;

import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.Gender;
import com.timesphere.timesphere.entity.type.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private String id;
    private String email;
    private String firstname;
    private String lastname;
    private Gender gender;
    private String avatarUrl;
    private Role role;         // 👑 Trả thẳng role
    private boolean isPremium; // ✅ tiện cho FE
    private boolean isAdmin;   // ✅ dùng cho quản trị


    public static UserProfileResponse from(User u) {
        return new UserProfileResponse(
                u.getId(),
                u.getEmail(),
                u.getFirstname(),
                u.getLastname(),
                u.getGender(),
                u.getAvatarUrl(),
                u.getRole(),                    // 👑 trả luôn role
                u.getRole() == Role.PREMIUM,   // ✅ xác định quyền premium
                u.getRole() == Role.ADMIN      // ✅ phân biệt quản trị
        );
    }
}
