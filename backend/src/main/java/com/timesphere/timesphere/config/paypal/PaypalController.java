package com.timesphere.timesphere.config.paypal;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.timesphere.timesphere.entity.type.PlanType;
import com.timesphere.timesphere.service.UpgradeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class PaypalController {

    private final PaypalService paypalService;
    private final UpgradeService upgradeService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/payment/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestParam("method") String method,
            @RequestParam("amount") String amount,
            @RequestParam("currency") String currency,
            @RequestParam("description") String description,
            @RequestParam("planType") PlanType planType
    ) {
        try {
            String cancelUrl = "http://localhost:5173/mainpage/upgrade?cancel=true";
            String successUrl = "http://localhost:5173/mainpage/upgrade?planType=" + planType.name();

            Payment payment = paypalService.createPayment(
                    Double.valueOf(amount),
                    currency,
                    method,
                    "sale",
                    description,
                    cancelUrl,
                    successUrl
            );

            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    log.info("PayPal approvalUrl = {}", links.getHref()); // 👀 để debug rõ
                    return ResponseEntity.ok(Map.of("approvalUrl", links.getHref()));
                }
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal error:", e);
        }

        return ResponseEntity.status(500).body(Map.of("error", "Unable to create PayPal payment"));
    }

    @GetMapping("/payment/success")
    @ResponseBody
    public Map<String, String> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("planType") PlanType planType
    ) {
        Map<String, String> result = new HashMap<>();

        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();

                String token = upgradeService.upgradeToPremiumAndIssueTokenWithSubscription(email, planType, paymentId);

                result.put("status", "success");
                result.put("token", token);
                return result;
            }
        } catch (PayPalRESTException e) {
            log.error("Execute PayPal error:", e);
        }

        result.put("status", "fail");
        return result;
    }


    @GetMapping("/payment/cancel")
    public String paymentCancel() {
        return "paymentCancel";
    }

    @GetMapping("/payment/error")
    public String paymentError() {
        return "paymentError";
    }
}

