package com.timesphere.timesphere.dto.user;

import com.timesphere.timesphere.entity.type.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String firstname;
    private String lastname;
    private Gender gender;
}
