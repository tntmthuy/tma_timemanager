package com.timesphere.timesphere.dto.focus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserFocusStats {
    private String userId;
    private String name;
    private String avatar;
    private int totalMinutes;
}