package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import com.timesphere.timesphere.dto.plan.PlanInfo;
import com.timesphere.timesphere.dto.plan.SubscriptionInfoDto;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.service.PlanService;
import com.timesphere.timesphere.service.UpgradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PlanController {

    private final PlanService planService;
    private final UpgradeService upgradeService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:payment_by_paypal')")
    public List<PlanInfo> getAllPlans() {
        return planService.getAvailablePlans();
    }

    @GetMapping("/subscription/me")
    @PreAuthorize("hasAuthority('user:payment_by_paypal')")
    public ResponseEntity<ApiResponse<List<SubscriptionInfoDto>>> getMySubscriptions(
            @AuthenticationPrincipal User user
    ) {
        List<SubscriptionInfoDto> result = upgradeService.getSubscriptionInfo(user);
        return ResponseEntity.ok(ApiResponse.success("Thông tin các gói đăng ký", result));
    }
}