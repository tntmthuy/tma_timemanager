package com.timesphere.timesphere.controller;

import com.timesphere.timesphere.dto.auth.AuthenticationRequest;
import com.timesphere.timesphere.dto.auth.EmailRequest;
import com.timesphere.timesphere.dto.auth.RegisterRequest;
import com.timesphere.timesphere.dto.auth.VerificationRequest;
import com.timesphere.timesphere.dto.auth.AuthenticationResponse;
import com.timesphere.timesphere.service.AuthenticationService;
import com.timesphere.timesphere.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserService userService;

    //đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        var response = service.register(request);
        if (request.isMfaEnabled()) {
            return ResponseEntity.ok(response);
        }
        System.out.println("🔍 Đăng ký email: " + request.getEmail());
        return ResponseEntity.accepted().build();
    }

    //đăng nhập
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    //
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(
            @RequestBody VerificationRequest verificationRequest
    ) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));

    }

    @PostMapping("/resend-secret")
    public ResponseEntity<?> resendSecret(@RequestBody EmailRequest request) {
        String newQrUri = service.regenerateSecretAndReturnQr(request.getEmail());
        return ResponseEntity.ok(Map.of("secretImageUri", newQrUri));
    }
}
