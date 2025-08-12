package com.timesphere.timesphere.entity.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.timesphere.timesphere.entity.type.Permission.*;

@Getter
@RequiredArgsConstructor
public enum Role {
    FREE(
            Set.of(
                    TEAM_WORKSPACE,
                    KANBAN_BOARD,
                    PROFILE_USER,
                    TASK_COMMENT,
                    NOTIFICATION_USER,
                    PAYMENT,
                    FOCUS
            )
    ),
    PREMIUM(
            Set.of(
                    TEAM_WORKSPACE,
                    KANBAN_BOARD,
                    PROFILE_USER,
                    TASK_COMMENT,
                    NOTIFICATION_USER,
                    PAYMENT,
                    CALENDAR,
                    FOCUS,
                    AI_SUGGESTION
            )
    ),
    ADMIN(
            Set.of(
                    ADMIN_READ_ALL_USERS,
                    TEAM_WORKSPACE,
                    KANBAN_BOARD,
                    PROFILE_USER,
                    TASK_COMMENT,
                    NOTIFICATION_USER,
                    PAYMENT,
                    FOCUS,
                    AI_SUGGESTION
            )
    );

    public final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
