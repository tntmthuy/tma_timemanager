package com.timesphere.timesphere.dto.plan;

import com.timesphere.timesphere.entity.type.PlanType;
import com.timesphere.timesphere.entity.type.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SubscriptionInfoDto {
    private String userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private PlanType planType;
    private SubscriptionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String paymentId;
}
