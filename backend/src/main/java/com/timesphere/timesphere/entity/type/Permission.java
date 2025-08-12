package com.timesphere.timesphere.entity.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Permission {
    TASK_COMMENT("user:task_comment"),

    ADMIN_READ_ALL_USERS("admin:read_all_users"),

    TEAM_WORKSPACE("user:manage_team"),

    KANBAN_BOARD("user:manage_board"),

    PROFILE_USER("user:manage_profile"),

    NOTIFICATION_USER("user:read_notification"),

    PAYMENT("user:payment_by_paypal"),

    CALENDAR("premium:get_calendar"),

    FOCUS("user:focus_sessions"),

    AI_SUGGESTION("premium:ai_suggestion")
    ;

    private final String permission;
}
