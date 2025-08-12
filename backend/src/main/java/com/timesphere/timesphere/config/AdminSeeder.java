package com.timesphere.timesphere.config;

import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.repository.UserRepository;
import com.timesphere.timesphere.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtService; // 👈 thêm service cấp token

    @Override
    public void run(String... args) {
        String adminEmail = "admin@timesphere.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            var admin = User.builder()
                    .firstname("Admin")
                    .lastname("System")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);

            String token = jwtService.generateToken(admin); // 👈 sinh token
            log.info("🤴🏻 Đã tạo tài khoản ADMIN mặc định: {}", adminEmail);
            log.info("🎟️  Access token dùng test: {}", token);
        } else {
            log.info("✅ Admin đã tồn tại: {}", adminEmail);
        }
    }
}
