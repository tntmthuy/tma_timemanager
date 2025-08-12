package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.dto.admin.UserSummaryDto;
import com.timesphere.timesphere.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserSummaryDto toSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}