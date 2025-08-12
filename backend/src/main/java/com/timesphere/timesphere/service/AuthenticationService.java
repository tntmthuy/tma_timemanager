package com.timesphere.timesphere.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timesphere.timesphere.dto.auth.AuthenticationRequest;
import com.timesphere.timesphere.dto.auth.VerificationRequest;
import com.timesphere.timesphere.dto.auth.AuthenticationResponse;
import com.timesphere.timesphere.dto.auth.RegisterRequest;
import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.entity.Token;
import com.timesphere.timesphere.entity.type.TokenType;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.repository.TokenRepository;
import com.timesphere.timesphere.repository.UserRepository;
import com.timesphere.timesphere.tfa.TwoFactorAuthenticationService;
import com.timesphere.timesphere.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

import static com.timesphere.timesphere.entity.type.UserStatus.ACTIVE;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;

    private final TwoFactorAuthenticationService tfaService;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // Kiểm tra email trùng trước khi tạo user
        if (repository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_REGISTERED);
        }

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mfaEnabled(request.isMfaEnabled())
                .status(ACTIVE)
                .build();

        // nếu mfa được bật --> tạo secret
        if (request.isMfaEnabled()) {
            user.setSecret(tfaService.generateNewSecret());
        }

        // Gán mặc định FREE
        user.setRole(Role.FREE);
        var savedUser = repository.save(user);
        System.out.println("✅ Lưu vào DB, email: " + savedUser.getEmail());

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // Kiểm tra email trước khi xác thực password
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.isMfaEnabled()) {
            AuthenticationResponse.builder()
                    .accessToken("")
                    .refreshToken("")
                    .mfaEnabled(true)
                    .build();
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(false)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .mfaEnabled(false)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public AuthenticationResponse verifyCode(
            VerificationRequest verificationRequest
    ) {
        User user = repository
                .findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %S ", verificationRequest.getEmail()))
                );
        if (tfaService.isOtpValid(user.getSecret(), verificationRequest.getCode())) {
            throw new BadCredentialsException("Code is not correct");
        }
        System.out.println("📩 Email from FE: " + verificationRequest.getEmail());
        System.out.println("🔐 OTP Code from FE: " + verificationRequest.getCode());
        System.out.println("🔍 User email: " + user.getEmail());
        System.out.println("🔐 Secret: " + user.getSecret());
        System.out.println("📥 Code nhập: " + verificationRequest.getCode());
        System.out.println("✅ Có đúng không? " + tfaService.isOtpValid(user.getSecret(), verificationRequest.getCode()));
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }

    public String regenerateSecretAndReturnQr(String email) {
        var user = repository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)); // ✅ dùng ErrorCode chuẩn

        if (!user.isMfaEnabled()) {
            throw new AppException(ErrorCode.MFA_NOT_ENABLED); // ⛔ bạn có thể tạo thêm mã riêng nếu cần, ví dụ MFA_NOT_ENABLED
        }

        String newSecret = tfaService.generateNewSecret();
        user.setSecret(newSecret);
        repository.save(user);

        return tfaService.generateQrCodeImageUri(newSecret);
    }
}
