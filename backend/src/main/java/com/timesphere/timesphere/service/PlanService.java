package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.plan.PlanInfo;
import com.timesphere.timesphere.entity.type.PlanType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlanService {

    public List<PlanInfo> getAvailablePlans() {
        return List.of(
                new PlanInfo(PlanType.WEEKLY, new BigDecimal("1.00"), "USD", "Weekly Plan"),
                new PlanInfo(PlanType.MONTHLY, new BigDecimal("3.00"), "USD", "Monthly Plan"),
                new PlanInfo(PlanType.YEARLY, new BigDecimal("25.00"), "USD", "Yearly Plan")
        );
    }
}
