package com.timesphere.timesphere.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSuggestionResponse {
    private String id;
    private String fullName;
    private String email;
    private String avatarUrl;
}
