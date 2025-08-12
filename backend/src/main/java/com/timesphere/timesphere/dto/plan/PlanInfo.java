package com.timesphere.timesphere.dto.plan;

import com.timesphere.timesphere.entity.type.PlanType;

import java.math.BigDecimal;

public record PlanInfo(
        PlanType type,
        BigDecimal price,
        String currency,
        String displayName
) {}

